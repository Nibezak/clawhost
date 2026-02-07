import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { claws, pendingClaws, sshKeys, volumes } from '../../db/schema'
import { hetzner } from '../../services/hetzner'
import { cloudflare } from '../../services/cloudflare'
import { generateSlug, generateToken, generateCloudInit, DOMAIN } from './helpers/index'

export interface ProvisionClawParams {
  pendingClawId: string
  subscriptionId: string
  customerId: string
  productId: string
}

/**
 * Provision a claw after successful payment
 * Called from webhook handler
 */
export async function provisionClaw(params: ProvisionClawParams): Promise<{
  success: boolean
  clawId?: string
  error?: string
}> {
  try {
    // Get pending claw
    const pendingClaw = await db
      .select()
      .from(pendingClaws)
      .where(eq(pendingClaws.id, params.pendingClawId))
      .limit(1)

    if (!pendingClaw[0]) {
      return { success: false, error: 'Pending claw not found' }
    }

    const pending = pendingClaw[0]

    // Check if claw already exists (idempotency)
    const existingClaw = await db
      .select()
      .from(claws)
      .where(eq(claws.polarSubscriptionId, params.subscriptionId))
      .limit(1)

    if (existingClaw[0]) {
      return { success: true, clawId: existingClaw[0].id }
    }

    // Generate claw ID and subdomain
    const id = crypto.randomUUID()
    const subdomain = generateSlug(id)
    const gatewayToken = generateToken()

    // Look up SSH key if provided
    let hetznerSshKeyIds: number[] | undefined
    if (pending.sshKeyId) {
      const sshKey = await db
        .select()
        .from(sshKeys)
        .where(eq(sshKeys.id, pending.sshKeyId))
        .limit(1)

      if (sshKey[0]?.hetznerKeyId) {
        hetznerSshKeyIds = [sshKey[0].hetznerKeyId]
      }
    }

    // Generate cloud-init script
    const cloudInitScript = generateCloudInit(
      pending.rootPassword || '',
      subdomain,
      DOMAIN,
      gatewayToken
    )

    // Create server in Hetzner
    const { serverId, ip } = await hetzner.createServer(
      `${pending.name}-${id.slice(0, 8)}`,
      pending.planId,
      pending.location,
      pending.rootPassword || undefined,
      hetznerSshKeyIds,
      '',
      cloudInitScript
    )

    // Create DNS record
    try {
      await cloudflare.createDNSRecord(subdomain, ip)
    } catch (dnsErr) {
      console.error('Failed to create DNS record:', dnsErr)
    }

    // Save claw to database
    await db.insert(claws).values({
      id,
      userId: pending.userId,
      name: pending.name,
      hetznerServerId: serverId.toString(),
      status: 'running',
      ip,
      planId: pending.planId,
      location: pending.location,
      rootPassword: pending.rootPassword,
      sshKeyId: pending.sshKeyId,
      subdomain,
      gatewayToken,
      polarSubscriptionId: params.subscriptionId,
      polarProductId: params.productId,
      polarCustomerId: params.customerId,
      subscriptionStatus: 'active',
    })

    // Create volume if requested
    if (pending.volumeSize && pending.volumeSize >= 10) {
      try {
        const volumeId = crypto.randomUUID()
        const hetznerVolume = await hetzner.createVolume(
          `${pending.name}-vol-${volumeId.slice(0, 8)}`,
          pending.volumeSize,
          pending.location,
          serverId
        )

        await db.insert(volumes).values({
          id: volumeId,
          userId: pending.userId,
          clawId: id,
          name: `${pending.name}-storage`,
          size: pending.volumeSize,
          hetznerVolumeId: hetznerVolume.id,
          location: pending.location,
          status: 'available',
        })
      } catch (volumeErr) {
        console.error('Failed to create volume:', volumeErr)
      }
    }

    // Delete pending claw record
    await db.delete(pendingClaws).where(eq(pendingClaws.id, params.pendingClawId))

    return { success: true, clawId: id }
  } catch (err) {
    console.error('Provision claw error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to provision claw' }
  }
}

import type { Context } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../../db'
import { claws, volumes } from '../../db/schema'
import { hetzner } from '../../services/hetzner'
import { cloudflare } from '../../services/cloudflare'
import { subscriptions } from '../../lib/polar'
import { DOMAIN } from './helpers/index'

const deleteClaw = async (c: Context<{ Variables: { userId: string } }>) => {
  try {
    const userId = c.get('userId')
    const id = c.req.param('id')

    const claw = await db
      .select()
      .from(claws)
      .where(and(eq(claws.id, id), eq(claws.userId, userId)))
      .limit(1)

    if (!claw[0]) {
      return c.json({ error: 'Claw not found' }, 404)
    }

    // Cancel subscription in Polar (if exists)
    if (claw[0].polarSubscriptionId) {
      try {
        // Immediately revoke the subscription (stops billing immediately)
        await subscriptions.revoke(claw[0].polarSubscriptionId)
        console.log(`Revoked subscription ${claw[0].polarSubscriptionId}`)
      } catch (subErr) {
        console.error('Failed to cancel subscription:', subErr)
        // Continue with deletion even if subscription cancellation fails
      }
    }

    // Get associated volumes
    const clawVolumes = await db.select().from(volumes).where(eq(volumes.clawId, id))

    // Delete volumes from Hetzner first (must detach before deleting server)
    for (const vol of clawVolumes) {
      if (vol.hetznerVolumeId) {
        try {
          await hetzner.detachVolume(vol.hetznerVolumeId)
          await hetzner.deleteVolume(vol.hetznerVolumeId)
        } catch (volErr) {
          console.error('Failed to delete volume:', volErr)
        }
      }
    }

    // Delete volumes from database
    await db.delete(volumes).where(eq(volumes.clawId, id))

    // Delete DNS record from Cloudflare
    if (claw[0].subdomain) {
      try {
        const dnsRecord = await cloudflare.findDNSRecord(claw[0].subdomain)
        if (dnsRecord) {
          await cloudflare.deleteDNSRecord(dnsRecord.id)
          console.log(`Deleted DNS record: ${claw[0].subdomain}.${DOMAIN}`)
        }
      } catch (dnsErr) {
        console.error('Failed to delete DNS record:', dnsErr)
      }
    }

    // Delete server from Hetzner
    if (claw[0].hetznerServerId) {
      await hetzner.deleteServer(claw[0].hetznerServerId)
    }

    // Delete claw from database
    await db.delete(claws).where(eq(claws.id, id))

    return c.json({ success: true })
  } catch (err) {
    console.error('Delete claw error:', err)
    return c.json({ error: err instanceof Error ? err.message : 'Failed to delete claw' }, 500)
  }
}

export default deleteClaw

import { eq } from 'drizzle-orm'
import { db } from '../../../db'
import { claws, volumes } from '../../../db/schema'
import { hetzner } from '../../../services/hetzner'
import { cloudflare } from '../../../services/cloudflare'

/**
 * Perform full infrastructure cleanup for a claw:
 * - Detach & delete Hetzner volumes
 * - Delete volume DB records
 * - Delete Cloudflare DNS record
 * - Delete Hetzner server
 * - Delete claw from database
 */
export async function cleanupClaw(
  clawId: string,
  claw: { hetznerServerId: string | null; subdomain: string | null }
): Promise<void> {
  // Get associated volumes
  const clawVolumes = await db.select().from(volumes).where(eq(volumes.clawId, clawId))

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
  await db.delete(volumes).where(eq(volumes.clawId, clawId))

  // Delete DNS record from Cloudflare
  if (claw.subdomain) {
    try {
      const dnsRecord = await cloudflare.findDNSRecord(claw.subdomain)
      if (dnsRecord) {
        await cloudflare.deleteDNSRecord(dnsRecord.id)
      }
    } catch (dnsErr) {
      console.error('Failed to delete DNS record:', dnsErr)
    }
  }

  // Delete server from Hetzner
  if (claw.hetznerServerId) {
    await hetzner.deleteServer(claw.hetznerServerId)
  }

  // Delete claw from database
  await db.delete(claws).where(eq(claws.id, clawId))
}

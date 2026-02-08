import type { ClawCleanupData } from '@/ts/Interfaces'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws, volumes } from '@/db/schema'
import { hetzner } from '@/services/hetzner'
import { cloudflare } from '@/services/cloudflare'

export async function cleanupClaw(
    clawId: string,
    claw: ClawCleanupData
): Promise<void> {
    const clawVolumes = await db
        .select()
        .from(volumes)
        .where(eq(volumes.clawId, clawId))

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

    await db.delete(volumes).where(eq(volumes.clawId, clawId))

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

    if (claw.hetznerServerId) {
        await hetzner.deleteServer(claw.hetznerServerId)
    }

    await db.delete(claws).where(eq(claws.id, clawId))
}
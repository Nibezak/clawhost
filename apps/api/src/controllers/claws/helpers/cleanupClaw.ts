import type { ClawCleanupData } from '@/ts/Interfaces'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws, clawExports, volumes } from '@/db/schema'
import { getProvider } from '@/services/provider'
import { cloudflare } from '@/services/cloudflare'

export async function cleanupClaw(
    clawId: string,
    claw: ClawCleanupData
): Promise<void> {
    const provider = getProvider(claw.provider)

    const clawVolumes = await db
        .select()
        .from(volumes)
        .where(eq(volumes.clawId, clawId))

    for (const vol of clawVolumes) {
        if (vol.providerVolumeId) {
            try {
                await provider.detachVolume(vol.providerVolumeId)
                await provider.deleteVolume(vol.providerVolumeId)
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

    if (claw.providerServerId) {
        try {
            await provider.deleteServer(claw.providerServerId)
        } catch (serverErr) {
            console.error('Failed to delete server:', serverErr)
        }
    }

    await db.delete(clawExports).where(eq(clawExports.clawId, clawId))
    await db.delete(claws).where(eq(claws.id, clawId))
}
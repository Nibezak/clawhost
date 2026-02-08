import type { CloudflareDNSRecord, CloudflareDNSLookup } from '@/ts/Interfaces'

import Cloudflare from 'cloudflare'

function getClient() {
    const token = process.env.CLOUDFLARE_API_TOKEN
    if (!token) {
        throw new Error('CLOUDFLARE_API_TOKEN is not set')
    }

    return new Cloudflare({ apiToken: token })
}

function getZoneId() {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID
    if (!zoneId) {
        throw new Error('CLOUDFLARE_ZONE_ID is not set')
    }
    return zoneId
}

export const cloudflare = {
    // Create DNS A record for subdomain
    async createDNSRecord(
        subdomain: string,
        ip: string
    ): Promise<CloudflareDNSRecord> {
        const client = getClient()
        const zoneId = getZoneId()

        const record = await client.dns.records.create({
            zone_id: zoneId,
            type: 'A',
            name: subdomain, // e.g., "abc123" will become "abc123.clawhost.cloud"
            content: ip,
            proxied: false, // Direct connection for WebSocket support
            ttl: 60 // 1 minute TTL for quick updates
        })

        return {
            id: record.id!,
            name: record.name!
        }
    },

    // Update DNS record IP address
    async updateDNSRecord(
        recordId: string,
        subdomain: string,
        ip: string
    ): Promise<void> {
        const client = getClient()
        const zoneId = getZoneId()

        await client.dns.records.update(recordId, {
            zone_id: zoneId,
            type: 'A',
            name: subdomain,
            content: ip,
            ttl: 60
        })
    },

    // Delete DNS record
    async deleteDNSRecord(recordId: string): Promise<void> {
        const client = getClient()
        const zoneId = getZoneId()

        await client.dns.records.delete(recordId, {
            zone_id: zoneId
        })
    },

    // Find DNS record by subdomain
    async findDNSRecord(
        subdomain: string
    ): Promise<CloudflareDNSLookup | null> {
        const client = getClient()
        const zoneId = getZoneId()
        const fullName = `${subdomain}.clawhost.cloud`

        const records = await client.dns.records.list({
            zone_id: zoneId,
            name: { exact: fullName },
            type: 'A'
        })

        const record = records.result?.[0]
        if (!record) return null

        return {
            id: record.id!,
            ip: record.content as string
        }
    }
}
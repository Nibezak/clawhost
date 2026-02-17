import type { ClawHubAPISearchHit, ClawHubAPISkillItem, ClawHubSearchResult, ClawHubSearchResultPage, SearchClawHubSkillsParams } from '@/ts/Interfaces'

import { RequestClient } from '@openclaw/shared'

const CACHE_TTL = 60 * 60 * 1000
const cache = new Map<string, { data: ClawHubSearchResultPage, expires: number }>()

const client = new RequestClient({
    baseUrl: 'https://clawhub.ai/api/v1'
})

const mapSearchHit = (hit: ClawHubAPISearchHit): ClawHubSearchResult => ({
    slug: hit.slug.toLowerCase(),
    name: hit.displayName || hit.slug,
    description: hit.summary || '',
    author: '',
    version: hit.version || '',
    downloads: 0,
    tags: []
})

const mapSkillItem = (item: ClawHubAPISkillItem): ClawHubSearchResult => ({
    slug: item.slug.toLowerCase(),
    name: item.displayName || item.slug,
    description: item.summary || '',
    author: item.author || '',
    version: item.version || '',
    downloads: item.downloads || 0,
    tags: item.tags || []
})

const getCached = (key: string): ClawHubSearchResultPage | null => {
    const entry = cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expires) {
        cache.delete(key)
        return null
    }
    return entry.data
}

const setCache = (key: string, data: ClawHubSearchResultPage): void => {
    cache.set(key, { data, expires: Date.now() + CACHE_TTL })
}

const searchSkills = async (params: SearchClawHubSkillsParams): Promise<ClawHubSearchResultPage> => {
    const limit = params.limit || 20
    const query = (params.query || '').trim()

    if (query) {
        const page = params.page || 1
        const cacheKey = `search:${query}:${limit}:${page}`
        const cached = getCached(cacheKey)
        if (cached) return cached

        const searchParams = new URLSearchParams({
            q: query,
            limit: String(limit)
        })

        const response = await client.get<{ results: ClawHubAPISearchHit[] }>(
            `/search?${searchParams.toString()}`
        )

        const skills = (response.results || []).map(mapSearchHit)
        const result: ClawHubSearchResultPage = {
            skills,
            nextCursor: null,
            hasMore: skills.length >= limit
        }
        setCache(cacheKey, result)
        return result
    }

    const cursor = params.cursor || null
    const cacheKey = `explore:trending:${limit}:${cursor || 'initial'}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    const searchParams = new URLSearchParams({
        sort: 'trending',
        limit: String(limit)
    })

    if (cursor) {
        searchParams.set('cursor', cursor)
    }

    const response = await client.get<{ items: ClawHubAPISkillItem[], nextCursor?: string | null }>(
        `/skills?${searchParams.toString()}`
    )

    const skills = (response.items || []).map(mapSkillItem)
    const result: ClawHubSearchResultPage = {
        skills,
        nextCursor: response.nextCursor || null,
        hasMore: skills.length >= limit
    }
    setCache(cacheKey, result)
    return result
}

export default searchSkills
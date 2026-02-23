import type { FeatureRequest } from '@/ts/Interfaces'
import type { FeatureRequestStatus } from '@/ts/Types'

const STATUS_PRIORITY: Record<FeatureRequestStatus, number> = {
    awaiting_approval: 1,
    requested: 2,
    marked_for_implementation: 3,
    implemented: 4
}

const sortFeatureRequests = (items: FeatureRequest[], sort: string): FeatureRequest[] => {
    return [...items].sort((a, b) => {
        const statusDiff =
            (STATUS_PRIORITY[a.status] ?? 5) -
            (STATUS_PRIORITY[b.status] ?? 5)
        if (statusDiff !== 0) return statusDiff
        if (sort === 'upvotes') return b.upvoteCount - a.upvoteCount
        return 0
    })
}

export default sortFeatureRequests
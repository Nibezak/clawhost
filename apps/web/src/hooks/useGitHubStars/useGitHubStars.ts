import type { GitHubStarsData } from '@/ts/Interfaces'

import { useQuery } from '@tanstack/react-query'
import GITHUB_STARS_QUERY_KEY from '@/hooks/useGitHubStars/GITHUB_STARS_QUERY_KEY'

const GITHUB_REPO = 'bfzli/clawhost'

const formatStars = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
    }
    return count.toString()
}

const fetchGitHubStars = async (): Promise<GitHubStarsData> => {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
    if (!response.ok) {
        throw new Error('Failed to fetch GitHub stars')
    }
    const data = await response.json()
    const count = data.stargazers_count ?? 0
    return {
        count,
        formatted: formatStars(count)
    }
}

const useGitHubStars = () => {
    return useQuery({
        queryKey: GITHUB_STARS_QUERY_KEY,
        queryFn: fetchGitHubStars,
        staleTime: 1000 * 60 * 5,
        retry: 1
    })
}

export default useGitHubStars
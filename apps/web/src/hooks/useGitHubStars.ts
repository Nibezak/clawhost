import type { GitHubStarsData } from '@/ts/Interfaces'
import { useQuery } from '@tanstack/react-query'

export const GITHUB_STARS_QUERY_KEY = ['github-stars'] as const

const GITHUB_REPO = 'bfzli/clawhost'
const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`

function formatStars(count: number): string {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
    }
    return count.toString()
}

async function fetchGitHubStars(): Promise<GitHubStarsData> {
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

export function useGitHubStars() {
    return useQuery({
        queryKey: GITHUB_STARS_QUERY_KEY,
        queryFn: fetchGitHubStars,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    })
}

export { GITHUB_REPO_URL }
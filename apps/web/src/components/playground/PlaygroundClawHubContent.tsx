import type { FC, ReactNode } from 'react'
import type {
    ClawHubInstalledResponse,
    ClawHubSearchResult,
    PlaygroundClawHubContentProps
} from '@/ts/Interfaces'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    ArrowsClockwiseIcon,
    CaretLeftIcon,
    CaretRightIcon,
    CircleNotchIcon,
    DownloadSimpleIcon,
    MagnifyingGlassIcon,
    StorefrontIcon,
    TrashIcon
} from '@phosphor-icons/react'
import { PanelPlaceholder } from '@/components'
import { Skeleton } from '@/components/ui'
import { api } from '@/lib'
import { useUIStore } from '@/lib/store'

const PAGE_SIZE = 20

const PlaygroundClawHubContent: FC<PlaygroundClawHubContentProps> = ({
    clawId,
    agentId
}): ReactNode => {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pendingSlug, setPendingSlug] = useState<string | null>(null)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search.trim())
            setPage(1)
        }, 400)
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [search])

    const browseKey = ['clawhub-browse', clawId, debouncedSearch, page]
    const installedKey = ['clawhub-installed', clawId, agentId]
    const updatesKey = ['clawhub-updates', clawId, agentId]

    const {
        data: browseData,
        isLoading: isBrowseLoading,
        isFetching: isBrowseFetching,
        isError: isBrowseError
    } = useQuery({
        queryKey: browseKey,
        queryFn: () => api.searchClawHubSkills(clawId, {
            query: debouncedSearch || undefined,
            limit: PAGE_SIZE,
            page,
            agentId
        }),
        staleTime: 30000,
        retry: 1,
        placeholderData: (prev) => prev
    })

    const { data: installedData } = useQuery({
        queryKey: installedKey,
        queryFn: () => api.getClawHubInstalled(clawId, agentId),
        staleTime: 30000,
        retry: 1
    })

    const { data: updatesData } = useQuery({
        queryKey: updatesKey,
        queryFn: () => api.checkClawHubUpdates(clawId, agentId),
        staleTime: 30000,
        retry: 1
    })

    const installedSlugs = useMemo(() => {
        const set = new Set<string>()
        installedData?.skills?.forEach((s) => set.add(s.slug))
        return set
    }, [installedData])

    const updatesMap = useMemo(() => {
        const map = new Map<string, string>()
        updatesData?.updates?.forEach((u) => {
            if (u.hasUpdate && u.latestVersion) {
                map.set(u.slug, u.latestVersion)
            }
        })
        return map
    }, [updatesData])

    const installMutation = useMutation({
        mutationFn: (slug: string) =>
            api.installClawHubSkill(clawId, { slug, agentId }),
        onSuccess: () => {
            showToast(t('playground.clawHubInstalled'), 'success')
            setPendingSlug(null)
            queryClient.invalidateQueries({ queryKey: installedKey })
        },
        onError: () => {
            showToast(t('playground.clawHubInstallFailed'), 'error')
            setPendingSlug(null)
        }
    })

    const removeMutation = useMutation({
        mutationFn: (slug: string) =>
            api.removeClawHubSkill(clawId, { slug, agentId }),
        onSuccess: (_: void, slug: string) => {
            showToast(t('playground.clawHubRemoved'), 'success')
            setPendingSlug(null)
            queryClient.setQueryData<ClawHubInstalledResponse>(
                installedKey,
                (old) => {
                    if (!old) return { skills: [] }
                    return { skills: old.skills.filter((s) => s.slug !== slug) }
                }
            )
        },
        onError: () => {
            showToast(t('playground.clawHubRemoveFailed'), 'error')
            setPendingSlug(null)
        }
    })

    const updateMutation = useMutation({
        mutationFn: (slug: string) =>
            api.updateClawHubSkill(clawId, { slug, agentId }),
        onSuccess: () => {
            showToast(t('playground.clawHubUpdated'), 'success')
            setPendingSlug(null)
            queryClient.invalidateQueries({ queryKey: installedKey })
            queryClient.invalidateQueries({ queryKey: updatesKey })
        },
        onError: () => {
            showToast(t('playground.clawHubUpdateFailed'), 'error')
            setPendingSlug(null)
        }
    })

    const handleAction = useCallback(
        (slug: string) => {
            if (pendingSlug) return
            setPendingSlug(slug)
            if (installedSlugs.has(slug)) {
                if (updatesMap.has(slug)) {
                    updateMutation.mutate(slug)
                } else {
                    removeMutation.mutate(slug)
                }
            } else {
                installMutation.mutate(slug)
            }
        },
        [pendingSlug, installedSlugs, updatesMap, installMutation, removeMutation, updateMutation]
    )

    const skills = browseData?.skills || []
    const hasNextPage = skills.length >= PAGE_SIZE
    const isFirstLoad = isBrowseLoading && !browseData

    return (
        <div className='flex h-full flex-col'>
            <div className='px-5 pt-5'>
                <div className='relative'>
                    <MagnifyingGlassIcon className='absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500' />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('playground.clawHubSearch')}
                        className='w-full rounded-md border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-xs text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                    />
                    {isBrowseFetching && !isFirstLoad && (
                        <CircleNotchIcon className='absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-gray-500' />
                    )}
                </div>
            </div>

            {isFirstLoad ? (
                <div className='flex-1 space-y-1.5 px-5 pt-3'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className='h-16 w-full rounded-lg' />
                    ))}
                </div>
            ) : isBrowseError ? (
                <div className='flex flex-1 items-center justify-center pb-16'>
                    <PanelPlaceholder
                        icon={
                            <StorefrontIcon
                                className='h-6 w-6 text-gray-500'
                                weight='duotone'
                            />
                        }
                        title={t('playground.clawHubLoadFailed')}
                        description={t('playground.clawHubLoadFailedDescription')}
                    />
                </div>
            ) : skills.length === 0 ? (
                <div className='flex flex-1 items-center justify-center pb-16'>
                    <PanelPlaceholder
                        icon={
                            <StorefrontIcon
                                className='h-6 w-6 text-gray-500'
                                weight='duotone'
                            />
                        }
                        title={t('playground.clawHubNoResults')}
                        description={t('playground.clawHubEmptyDescription')}
                    />
                </div>
            ) : (
                <div className='flex-1 overflow-y-auto px-5 pt-3 pb-5'>
                    <div className='space-y-1.5'>
                        {skills.map((skill: ClawHubSearchResult) => {
                            const isInstalled = installedSlugs.has(skill.slug)
                            const hasUpdate = updatesMap.has(skill.slug)
                            const latestVersion = updatesMap.get(skill.slug)
                            const isPending = pendingSlug === skill.slug

                            return (
                                <div
                                    key={skill.slug}
                                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                                        isInstalled
                                            ? 'border-[#ef5350]/20 bg-[#ef5350]/5'
                                            : 'border-white/5 bg-white/[0.02]'
                                    }`}
                                >
                                    <div className='min-w-0 flex-1'>
                                        <span className='block text-xs font-medium text-white'>
                                            {skill.name}
                                        </span>
                                        {skill.description && (
                                            <span className='mt-0.5 block truncate text-[11px] text-gray-500'>
                                                {skill.description}
                                            </span>
                                        )}
                                        <div className='mt-1 flex items-center gap-2'>
                                            {skill.author && (
                                                <span className='text-[10px] text-gray-600'>
                                                    {t('playground.clawHubBy', { author: skill.author })}
                                                </span>
                                            )}
                                            {skill.version && (
                                                <span className='text-[10px] text-gray-600'>
                                                    {t('playground.clawHubVersion', { version: skill.version })}
                                                </span>
                                            )}
                                            {skill.downloads > 0 && (
                                                <span className='text-[10px] text-gray-600'>
                                                    {t('playground.clawHubDownloads', { count: skill.downloads.toLocaleString() })}
                                                </span>
                                            )}
                                            {hasUpdate && latestVersion && (
                                                <span className='text-[10px] text-amber-400'>
                                                    {t('playground.clawHubUpdateAvailable', { version: latestVersion })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAction(skill.slug)}
                                        disabled={!!pendingSlug}
                                        className={`ml-3 flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                            isInstalled && hasUpdate
                                                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                                : isInstalled
                                                    ? 'bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                                                    : 'bg-[#ef5350]/10 text-[#ef5350] hover:bg-[#ef5350]/20'
                                        }`}
                                    >
                                        {isPending ? (
                                            <CircleNotchIcon className='h-3 w-3 animate-spin' />
                                        ) : isInstalled && hasUpdate ? (
                                            <>
                                                <ArrowsClockwiseIcon className='h-3 w-3' />
                                                {t('playground.clawHubUpdate')}
                                            </>
                                        ) : isInstalled ? (
                                            <>
                                                <TrashIcon className='h-3 w-3' />
                                                {t('playground.clawHubRemove')}
                                            </>
                                        ) : (
                                            <>
                                                <DownloadSimpleIcon className='h-3 w-3' />
                                                {t('playground.clawHubInstall')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {(page > 1 || hasNextPage) && (
                        <div className='mt-3 flex items-center justify-center gap-3'>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className='flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30'
                            >
                                <CaretLeftIcon className='h-3 w-3' />
                            </button>
                            <span className='text-[11px] text-gray-500'>
                                {page}
                            </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!hasNextPage}
                                className='flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30'
                            >
                                <CaretRightIcon className='h-3 w-3' />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default PlaygroundClawHubContent
import type { FC, ReactNode } from 'react'
import type {
    BundledSkillInfo,
    ClawSkillsResponse,
    GetAgentSkillsResponse,
    PlaygroundSkillsContentProps,
    SkillEntryConfig
} from '@/ts/Interfaces'
import type { SkillsViewTab } from '@/ts/Types'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { t } from '@openclaw/i18n'
import {
    CircleNotch,
    Cube,
    Lightning,
    MagnifyingGlass,
    Storefront
} from '@phosphor-icons/react'
import { PanelPlaceholder } from '@/components'
import { Skeleton } from '@/components/ui'
import { api } from '@/lib'
import { useUIStore } from '@/lib/store'
import PlaygroundClawHubContent from '@/components/playground/PlaygroundClawHubContent'

const PlaygroundSkillsContent: FC<PlaygroundSkillsContentProps> = ({
    clawId,
    agentId
}): ReactNode => {
    const isAgentMode = !!agentId
    const [viewTab, setViewTab] = useState<SkillsViewTab>('bundled')
    const [skills, setSkills] = useState<BundledSkillInfo[]>([])
    const [entries, setEntries] = useState<Record<string, SkillEntryConfig>>({})
    const [search, setSearch] = useState('')
    const [pendingSkill, setPendingSkill] = useState<string | null>(null)
    const { showToast } = useUIStore()
    const queryClient = useQueryClient()

    const clawQueryKey = ['claw-skills', clawId]
    const agentQueryKey = ['agent-skills', clawId, agentId]

    const {
        data: clawSkillsData,
        isLoading: isClawSkillsLoading,
        isError: isClawSkillsError
    } = useQuery({
        queryKey: clawQueryKey,
        queryFn: () => api.getClawSkills(clawId),
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    const {
        data: agentSkillsData,
        isLoading: isAgentSkillsLoading,
        isError: isAgentSkillsError
    } = useQuery({
        queryKey: agentQueryKey,
        queryFn: () => api.getAgentSkills(clawId, agentId!),
        enabled: isAgentMode,
        staleTime: 0,
        gcTime: 0,
        retry: 1
    })

    useEffect(() => {
        if (clawSkillsData && !isAgentMode) {
            setSkills(clawSkillsData.skills || [])
            setEntries(clawSkillsData.entries || {})
        }
    }, [clawSkillsData, isAgentMode])

    const installedSet = useMemo(() => {
        const set = new Set<string>()
        agentSkillsData?.skills?.forEach((s) => set.add(s.name))
        return set
    }, [agentSkillsData])

    const skillsList = useMemo(
        () => clawSkillsData?.skills || [],
        [clawSkillsData]
    )

    const displaySkills = isAgentMode ? skillsList : skills

    const filteredSkills = useMemo(() => {
        if (!search.trim()) return displaySkills
        const q = search.toLowerCase()
        return displaySkills.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                (s.description && s.description.toLowerCase().includes(q))
        )
    }, [displaySkills, search])

    const isLoading = isClawSkillsLoading || (isAgentMode && isAgentSkillsLoading)
    const isError = isClawSkillsError || (isAgentMode && isAgentSkillsError)

    const clawToggleMutation = useMutation({
        mutationFn: (name: string) => {
            const updatedSkills = skills.map((s) =>
                s.name === name ? { ...s, enabled: !s.enabled } : s
            )
            const updatedEntries: Record<string, SkillEntryConfig> = {}
            for (const skill of updatedSkills) {
                updatedEntries[skill.name] = {
                    ...entries[skill.name],
                    enabled: skill.enabled
                }
            }
            return api.updateClawSkills(clawId, { entries: updatedEntries })
        },
        onMutate: (name: string) => {
            setPendingSkill(name)
            setSkills((prev) =>
                prev.map((s) =>
                    s.name === name ? { ...s, enabled: !s.enabled } : s
                )
            )
            setEntries((prev) => {
                const current = prev[name] || { enabled: true }
                return {
                    ...prev,
                    [name]: { ...current, enabled: !current.enabled }
                }
            })
        },
        onSuccess: () => {
            setPendingSkill(null)
            queryClient.setQueryData<ClawSkillsResponse>(
                clawQueryKey,
                { skills, entries }
            )
        },
        onError: (_: unknown, name: string) => {
            showToast(t('playground.skillsSaveFailed'), 'error')
            setPendingSkill(null)
            setSkills((prev) =>
                prev.map((s) =>
                    s.name === name ? { ...s, enabled: !s.enabled } : s
                )
            )
            setEntries((prev) => {
                const current = prev[name] || { enabled: true }
                return {
                    ...prev,
                    [name]: { ...current, enabled: !current.enabled }
                }
            })
        }
    })

    const installMutation = useMutation({
        mutationFn: (name: string) =>
            api.updateAgentSkills(clawId, agentId!, {
                action: 'install',
                skillName: name
            }),
        onSuccess: (_: void, name: string) => {
            showToast(t('playground.agentSkillsInstalled'), 'success')
            setPendingSkill(null)
            queryClient.setQueryData<GetAgentSkillsResponse>(
                agentQueryKey,
                (old) => {
                    if (!old) return { skills: [{ name }] }
                    return { skills: [...old.skills, { name }] }
                }
            )
        },
        onError: () => {
            showToast(t('playground.agentSkillsInstallFailed'), 'error')
            setPendingSkill(null)
        }
    })

    const removeMutation = useMutation({
        mutationFn: (name: string) =>
            api.updateAgentSkills(clawId, agentId!, {
                action: 'remove',
                skillName: name
            }),
        onSuccess: (_: void, name: string) => {
            showToast(t('playground.agentSkillsRemoved'), 'success')
            setPendingSkill(null)
            queryClient.setQueryData<GetAgentSkillsResponse>(
                agentQueryKey,
                (old) => {
                    if (!old) return { skills: [] }
                    return { skills: old.skills.filter((s) => s.name !== name) }
                }
            )
        },
        onError: () => {
            showToast(t('playground.agentSkillsRemoveFailed'), 'error')
            setPendingSkill(null)
        }
    })

    const handleAction = useCallback(
        (name: string) => {
            if (pendingSkill) return
            if (isAgentMode) {
                setPendingSkill(name)
                if (installedSet.has(name)) {
                    removeMutation.mutate(name)
                } else {
                    installMutation.mutate(name)
                }
            } else {
                clawToggleMutation.mutate(name)
            }
        },
        [isAgentMode, pendingSkill, installedSet, removeMutation, installMutation, clawToggleMutation]
    )

    const isActive = useCallback(
        (skill: BundledSkillInfo) => {
            if (isAgentMode) return installedSet.has(skill.name)
            return skill.enabled
        },
        [isAgentMode, installedSet]
    )

    if (viewTab === 'clawhub') {
        return (
            <div className='flex h-full flex-col'>
                <div className='px-5 pt-5'>
                    <div className='mb-3 flex gap-1.5'>
                        <button
                            onClick={() => setViewTab('bundled')}
                            className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-500 transition-all hover:border-white/10 hover:bg-white/5 hover:text-gray-300'
                        >
                            <Cube className='h-3.5 w-3.5' />
                            {t('playground.skillsBundledTab')}
                        </button>
                        <button
                            onClick={() => setViewTab('clawhub')}
                            className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ef5350]/30 bg-[#ef5350]/10 px-3 py-2 text-xs font-medium text-[#ef5350] shadow-[0_0_12px_rgba(239,83,80,0.1)] transition-all'
                        >
                            <Storefront className='h-3.5 w-3.5' weight='duotone' />
                            {t('playground.skillsClawHubTab')}
                        </button>
                    </div>
                </div>
                <div className='flex-1 overflow-hidden'>
                    <PlaygroundClawHubContent clawId={clawId} agentId={agentId} />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='space-y-3 p-5'>
                <Skeleton className='h-8 w-full rounded-lg' />
                <Skeleton className='h-9 w-full rounded-md' />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className='h-14 w-full rounded-lg' />
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className='flex h-full items-center justify-center p-5'>
                <PanelPlaceholder
                    icon={
                        <Lightning
                            className='h-6 w-6 text-gray-500'
                            weight='duotone'
                        />
                    }
                    title={t('playground.skillsLoadFailed')}
                    description={t('playground.skillsLoadFailedDescription')}
                />
            </div>
        )
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='px-5 pt-5'>
                <div className='mb-3 flex gap-1.5'>
                    <button
                        onClick={() => setViewTab('bundled')}
                        className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#ef5350]/30 bg-[#ef5350]/10 px-3 py-2 text-xs font-medium text-[#ef5350] shadow-[0_0_12px_rgba(239,83,80,0.1)] transition-all'
                    >
                        <Cube className='h-3.5 w-3.5' weight='duotone' />
                        {t('playground.skillsBundledTab')}
                    </button>
                    <button
                        onClick={() => setViewTab('clawhub')}
                        className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-500 transition-all hover:border-white/10 hover:bg-white/5 hover:text-gray-300'
                    >
                        <Storefront className='h-3.5 w-3.5' />
                        {t('playground.skillsClawHubTab')}
                    </button>
                </div>

                <div className='relative mb-3'>
                    <MagnifyingGlass className='absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500' />
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('playground.skillsSearch')}
                        className='w-full rounded-md border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#ef5350]/50'
                    />
                </div>
            </div>

            {filteredSkills.length === 0 ? (
                <div className='flex flex-1 items-center justify-center pb-16'>
                    <PanelPlaceholder
                        icon={
                            <Lightning
                                className='h-6 w-6 text-gray-500'
                                weight='duotone'
                            />
                        }
                        title={displaySkills.length === 0
                            ? t('playground.skillsEmpty')
                            : t('playground.skillsNoResults')}
                        description={isAgentMode
                            ? t('playground.agentSkillsEmptyDescription')
                            : t('playground.skillsLoadFailedDescription')}
                    />
                </div>
            ) : (
                <div className='flex-1 overflow-y-auto px-5 pb-5'>
                    <div className='space-y-1.5'>
                        {filteredSkills.map((skill) => {
                            const active = isActive(skill)
                            const isPending = pendingSkill === skill.name

                            return (
                                <div
                                    key={skill.name}
                                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors ${
                                        active
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
                                    </div>
                                    <button
                                        onClick={() => handleAction(skill.name)}
                                        disabled={!!pendingSkill}
                                        className={`ml-3 flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                            active
                                                ? 'bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                                                : 'bg-[#ef5350]/10 text-[#ef5350] hover:bg-[#ef5350]/20'
                                        }`}
                                    >
                                        {isPending ? (
                                            <CircleNotch className='h-3 w-3 animate-spin' />
                                        ) : active ? (
                                            isAgentMode
                                                ? t('playground.agentSkillsRemove')
                                                : t('playground.skillsDisable')
                                        ) : (
                                            isAgentMode
                                                ? t('playground.agentSkillsInstall')
                                                : t('playground.skillsEnable')
                                        )}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlaygroundSkillsContent
import type { FC, ReactNode } from 'react'
import type { ProviderType } from '@/ts/Types'

import { motion, AnimatePresence } from 'framer-motion'
import { WarningIcon } from '@phosphor-icons/react'
import { t } from '@openclaw/i18n'
import { clawProvider } from '@openclaw/shared'
import { usePlans } from '@/hooks'
import { useUIStore } from '@/lib/store'

const providerLabels: Record<string, string> = {
    [clawProvider.hetzner]: t('createClaw.providerHetzner'),
    [clawProvider.digitalocean]: t('createClaw.providerDigitalOcean'),
    [clawProvider.vultr]: t('createClaw.providerVultr')
}

const AnnouncementBanner: FC = (): ReactNode => {
    const {
        plans: hetznerPlans,
        isLoading: hetznerLoading,
        atCapacity: hetznerAtCapacity
    } = usePlans(clawProvider.hetzner)
    const {
        plans: digitaloceanPlans,
        isLoading: digitaloceanLoading,
        atCapacity: digitaloceanAtCapacity
    } = usePlans(clawProvider.digitalocean)
    const {
        plans: vultrPlans,
        isLoading: vultrLoading,
        atCapacity: vultrAtCapacity
    } = usePlans(clawProvider.vultr)

    const isProviderUnavailable = (p: ProviderType): boolean => {
        if (p === clawProvider.hetzner)
            return !hetznerLoading && (!hetznerPlans?.length || hetznerAtCapacity)
        if (p === clawProvider.digitalocean)
            return !digitaloceanLoading && (!digitaloceanPlans?.length || digitaloceanAtCapacity)
        if (p === clawProvider.vultr)
            return !vultrLoading && (!vultrPlans?.length || vultrAtCapacity)
        return false
    }

    const allLoading = hetznerLoading && digitaloceanLoading && vultrLoading

    const unavailableProviders = [
        clawProvider.hetzner,
        clawProvider.digitalocean,
        clawProvider.vultr
    ].filter((p) => isProviderUnavailable(p))

    const { phBannerVisible } = useUIStore()

    const visible =
        !allLoading && !phBannerVisible && unavailableProviders.length > 0

    const providersText = unavailableProviders
        .map((p) => providerLabels[p])
        .join(', ')

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className='relative z-50 overflow-hidden'
                >
                    <div className='relative border-b border-amber-500/10 bg-white dark:bg-[#0a0a0f]'>
                        <div className='absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 dark:from-amber-500/10 dark:to-amber-500/10' />
                        <div className='relative px-4 pb-2 pt-3 text-center text-sm leading-6'>
                            <p className='inline'>
                                <span className='mb-[3px] inline-flex items-center gap-2 align-middle'>
                                    <WarningIcon
                                        size={16}
                                        weight='fill'
                                        className='text-amber-500'
                                    />
                                    <span className='font-semibold text-amber-500'>
                                        {t('announcement.title')}
                                    </span>
                                </span>
                                <span className='text-foreground/30 hidden sm:inline'>
                                    {' \u2002—\u2002 '}
                                </span>
                                <span className='text-foreground/60'>
                                    {t('announcement.message', {
                                        providers: providersText
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AnnouncementBanner
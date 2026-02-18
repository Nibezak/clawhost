import type { FC, ReactNode } from 'react'
import type { CreateClawModalProps } from '@/ts/Interfaces'
import type { ProviderType } from '@/ts/Types'

import { useState, useEffect } from 'react'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import {
    usePurchaseClaw,
    usePlans,
    useLocations,
    useVolumePricing,
    usePlanAvailability
} from '@/hooks'
import { generatePassword, locationFlags } from '@/lib/claw-utils'
import {
    Button,
    Input,
    Slider,
    Label,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    Skeleton
} from '@/components/ui'
import {
    CircleNotchIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    CopyIcon,
    ArrowClockwiseIcon,
    CaretDownIcon
} from '@phosphor-icons/react'
import { ClawMascot } from '@/components'

const CreateClawModal: FC<CreateClawModalProps> = ({
    plans: initialPlans,
    locations: initialLocations,
    sshKeys,
    volumePricing: initialVolumePricing,
    planAvailability: initialPlanAvailability,
    preselectedPlanId,
    preselectedProvider,
    onClose,
    onNavigateToSSHKeys
}): ReactNode => {
    const [name, setName] = useState('')
    const [provider, setProvider] = useState<ProviderType>(
        preselectedProvider || 'hetzner'
    )

    const {
        plans: providerPlans,
        isLoading: isLoadingPlans,
        atCapacity
    } = usePlans(provider)
    const { data: providerLocations, isLoading: isLoadingLocations } =
        useLocations(provider)
    const { data: providerVolumePricing } = useVolumePricing(provider)
    const { data: providerPlanAvailability } = usePlanAvailability(provider)

    const isProviderLoading = isLoadingPlans || isLoadingLocations
    const plans = providerPlans || initialPlans
    const locations = providerLocations || initialLocations
    const volumePricing = providerVolumePricing || initialVolumePricing
    const planAvailability = providerPlanAvailability || initialPlanAvailability

    const isPlanAvailable = (id: string): boolean => {
        if (!planAvailability) return true
        const available = planAvailability[id]
        if (!available) return true
        return available.length > 0
    }

    const getFirstEnabledPlan = (planList: typeof plans): string => {
        const enabled = planList.find(
            (p) => !p.disabled && isPlanAvailable(p.id)
        )
        return enabled?.id || planList.find((p) => !p.disabled)?.id || ''
    }

    const initialPlanId =
        preselectedPlanId &&
        plans.find((p) => p.id === preselectedPlanId && !p.disabled)
            ? preselectedPlanId
            : getFirstEnabledPlan(plans)
    const [planId, setPlanId] = useState(initialPlanId)

    const isLocationAvailableForPlan = (
        locationId: string,
        selectedPlanId: string
    ): boolean => {
        if (!planAvailability) return true
        const available = planAvailability[selectedPlanId]
        if (!available) return true
        return available.includes(locationId)
    }

    const getFirstAvailableLocation = (selectedPlanId: string): string => {
        const available = locations.find(
            (l) =>
                !l.disabled && isLocationAvailableForPlan(l.id, selectedPlanId)
        )
        return available?.id || locations[0]?.id || ''
    }

    const [location, setLocation] = useState(
        getFirstAvailableLocation(initialPlanId)
    )
    const [password, setPassword] = useState(generatePassword())
    const [showPassword, setShowPassword] = useState(false)
    const [selectedSshKeyId, setSelectedSshKeyId] = useState<string>('')
    const [volumeSize, setVolumeSize] = useState<number>(0)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const { showToast } = useUIStore()

    const handleProviderChange = (newProvider: ProviderType) => {
        setProvider(newProvider)
        setPlanId('')
        setLocation('')
        setVolumeSize(0)
    }

    useEffect(() => {
        if (!planId && plans.length > 0) {
            const firstPlan = getFirstEnabledPlan(plans)
            if (firstPlan) {
                setPlanId(firstPlan)
                setLocation(getFirstAvailableLocation(firstPlan))
            }
        }
    }, [plans, locations])

    useEffect(() => {
        if (planAvailability && planId) {
            if (!isPlanAvailable(planId)) {
                const betterPlan = getFirstEnabledPlan(plans)
                if (betterPlan) {
                    setPlanId(betterPlan)
                    setLocation(getFirstAvailableLocation(betterPlan))
                    return
                }
            }
            const currentAvailable = isLocationAvailableForPlan(
                location,
                planId
            )
            const currentDisabled = locations.find(
                (l) => l.id === location
            )?.disabled
            if (!currentAvailable || currentDisabled) {
                setLocation(getFirstAvailableLocation(planId))
            }
        }
    }, [planAvailability, planId])

    const purchaseMutation = usePurchaseClaw()

    const handleCreate = () => {
        if (!location) {
            showToast(t('errors.invalidLocation'), 'error')
            return
        }

        const selectedPlanData = plans.find((p) => p.id === planId)
        if (!selectedPlanData) {
            showToast(t('errors.invalidPlan'), 'error')
            return
        }

        let totalPrice = selectedPlanData.priceMonthly
        if (volumeSize > 0 && volumePricing) {
            totalPrice += volumeSize * volumePricing.pricePerGbMonthly
        }

        purchaseMutation.mutate(
            {
                name,
                provider,
                planId,
                location,
                password: password || undefined,
                sshKeyId: selectedSshKeyId || undefined,
                volumeSize: volumeSize > 0 ? volumeSize : undefined,
                priceMonthly: totalPrice
            },
            {
                onSuccess: (data) => {
                    if ((data as unknown as { error?: string }).error) {
                        showToast(
                            (data as unknown as { error: string }).error,
                            'error'
                        )
                        return
                    }
                    window.location.href = data.checkoutUrl
                },
                onError: (err: Error) => {
                    showToast(
                        err.message || t('errors.failedToCreateClaw'),
                        'error'
                    )
                }
            }
        )
    }

    const selectedPlan = plans.find((p) => p.id === planId && !p.disabled)

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className='flex max-h-[85vh] max-w-lg flex-col gap-0 p-0'>
                <DialogHeader className='shrink-0 px-6 pb-4 pt-6'>
                    <DialogTitle>{t('createClaw.title')}</DialogTitle>
                    <DialogDescription>
                        {t('createClaw.description')}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleCreate()
                    }}
                    className='flex-1 space-y-5 overflow-y-auto px-6 pb-6'
                >
                    <div className='space-y-2'>
                        <Label>{t('createClaw.clawName')}</Label>
                        <Input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('createClaw.clawNamePlaceholder')}
                            className='h-11'
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>
                            {t('createClaw.provider')}
                            <span className='text-red-600 dark:text-red-400'> *</span>
                        </Label>
                        <div className='bg-muted flex w-fit rounded-lg p-1'>
                            <button
                                type='button'
                                onClick={() => handleProviderChange('hetzner')}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    provider === 'hetzner'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <svg
                                    className='h-4 w-4'
                                    viewBox='0 0 63 64'
                                    fill='none'
                                >
                                    <rect
                                        width='63'
                                        height='64'
                                        rx='31.5'
                                        fill='#D50C2D'
                                    />
                                    <path
                                        d='M48.3772 14H43.4235C42.3132 14 41.8434 14.465 41.8434 15.564V27.9493H22.1566V15.564C22.1566 14.465 21.6868 14 20.5765 14H15.5801C14.4697 14 14 14.465 14 15.564V47.436C14 48.535 14.4697 49 15.5801 49H20.5765C21.6868 49 22.1566 48.5773 22.1566 47.436V34.8394H41.8861V47.436C41.8861 48.535 42.3559 49 43.4662 49H48.4199C49.5302 49 50 48.535 50 47.436V15.564C49.9573 14.5072 49.4875 14 48.3772 14Z'
                                        fill='white'
                                    />
                                </svg>
                                {t('createClaw.providerHetzner')}
                            </button>
                            <button
                                type='button'
                                onClick={() =>
                                    handleProviderChange('digitalocean')
                                }
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    provider === 'digitalocean'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <svg
                                    className='h-4 w-4'
                                    viewBox='0 0 512 512'
                                    fill='none'
                                >
                                    <path
                                        d='M78 373v-47h47v104h57V300h74v147A191 191 0 1065 256h74a117 117 0 11117 117'
                                        fill='#0080FF'
                                    />
                                </svg>
                                {t('createClaw.providerDigitalOcean')}
                            </button>
                            <button
                                type='button'
                                onClick={() => handleProviderChange('vultr')}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    provider === 'vultr'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <svg
                                    className='h-4 w-4'
                                    viewBox='0 0 1024 1024'
                                    fill='none'
                                >
                                    <circle
                                        cx='512'
                                        cy='512'
                                        r='512'
                                        fill='#007BFC'
                                    />
                                    <path
                                        d='M259.9 357.4c-2.5-3.9-3.9-8.6-3.9-13.6 0-14.1 11.5-25.6 25.6-25.6h131.1c9.1 0 17.1 4.8 21.7 12l181.9 288.5c2.5 4 3.9 8.6 3.9 13.6s-1.5 9.7-3.9 13.6l-65.6 104c-4.5 7.2-12.5 12-21.7 12-9.1 0-17.1-4.8-21.7-12L259.9 357.4zm395.3 158.1c4.5 7.2 12.5 11.9 21.7 11.9 9.1 0 17.1-4.8 21.7-11.9l22.6-35.8 43-68.2c2.5-3.9 3.9-8.6 3.9-13.7 0-5-1.5-9.7-3.9-13.7L730.1 330c-4.5-7.2-12.5-12-21.7-12H577.1c-14.1 0-25.6 11.5-25.6 25.6 0 5 1.4 9.7 3.9 13.6l99.8 158.3z'
                                        fill='white'
                                    />
                                </svg>
                                {t('createClaw.providerVultr')}
                            </button>
                        </div>
                        {atCapacity && (
                            <p className='mt-2 rounded-md bg-yellow-500/10 px-3 py-2 text-xs text-yellow-600 dark:text-yellow-400'>
                                {t('createClaw.providerAtCapacity')}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.location')}
                            <span className='text-red-600 dark:text-red-400'> *</span>
                        </Label>
                        {isProviderLoading ? (
                            <div className='grid grid-cols-2 gap-2'>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className='h-10 rounded-lg'
                                    />
                                ))}
                            </div>
                        ) : (
                            <TooltipProvider delayDuration={200}>
                                <div className='grid grid-cols-2 gap-2'>
                                    {locations.map((loc) => {
                                        const isSelected = location === loc.id
                                        const locFlag =
                                            locationFlags[loc.id] || ''
                                        const unavailableForPlan =
                                            !isLocationAvailableForPlan(
                                                loc.id,
                                                planId
                                            )
                                        const isDisabled =
                                            loc.disabled ||
                                            unavailableForPlan ||
                                            atCapacity
                                        const locationLabel = loc.country
                                            ? `${loc.city}, ${loc.country}`
                                            : loc.city

                                        const tooltipText = loc.disabled
                                            ? t(
                                                  'createClaw.locationUnavailable'
                                              )
                                            : t(
                                                  'createClaw.locationUnavailableForPlan'
                                              )

                                        const card = (
                                            <label
                                                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                                                    isDisabled
                                                        ? 'bg-muted/50 cursor-not-allowed border border-transparent opacity-50'
                                                        : isSelected
                                                          ? 'cursor-pointer border border-[#ef5350]/50 bg-[#ef5350]/20'
                                                          : 'bg-muted hover:bg-muted/80 cursor-pointer border border-transparent'
                                                }`}
                                            >
                                                <input
                                                    type='radio'
                                                    name='location'
                                                    value={loc.id}
                                                    checked={isSelected}
                                                    disabled={isDisabled}
                                                    onChange={(e) =>
                                                        setLocation(
                                                            e.target.value
                                                        )
                                                    }
                                                    className='sr-only'
                                                />
                                                {locFlag && (
                                                    <span className='text-lg'>
                                                        {locFlag}
                                                    </span>
                                                )}
                                                <p className='text-sm font-medium'>
                                                    {locationLabel}
                                                </p>
                                            </label>
                                        )

                                        if (isDisabled) {
                                            return (
                                                <Tooltip key={loc.id}>
                                                    <TooltipTrigger asChild>
                                                        <div>{card}</div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {tooltipText}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        }

                                        return <div key={loc.id}>{card}</div>
                                    })}
                                </div>
                            </TooltipProvider>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.plan')}
                            <span className='text-red-600 dark:text-red-400'> *</span>
                        </Label>
                        {isProviderLoading ? (
                            <div className='space-y-2'>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className='h-14 rounded-lg'
                                    />
                                ))}
                            </div>
                        ) : (
                            <TooltipProvider delayDuration={200}>
                                <div className='space-y-2'>
                                    {plans.map((plan, index) => {
                                        const isSelected = planId === plan.id
                                        const isDisabled =
                                            plan.disabled ||
                                            !isPlanAvailable(plan.id)

                                        const tierStarts: Record<
                                            string,
                                            Record<string, string>
                                        > = {
                                            hetzner: {
                                                cx23: t('landing.tierShared'),
                                                cax11: t('landing.tierArm'),
                                                ccx13: t(
                                                    'landing.tierDedicated'
                                                )
                                            },
                                            vultr: {
                                                'vc2-2c-4gb': t(
                                                    'landing.tierRegular'
                                                ),
                                                'vhp-2c-4gb-amd': t(
                                                    'landing.tierHighPerformance'
                                                ),
                                                'vhf-3c-8gb': t(
                                                    'landing.tierHighFrequency'
                                                )
                                            }
                                        }
                                        const providerTiers =
                                            tierStarts[provider]
                                        const tierLabel =
                                            providerTiers?.[plan.id]

                                        const card = (
                                            <label
                                                className={`flex items-center justify-between rounded-lg p-3 transition ${
                                                    isDisabled
                                                        ? 'bg-muted/50 cursor-not-allowed border border-transparent opacity-50'
                                                        : isSelected
                                                          ? 'cursor-pointer border border-[#ef5350]/50 bg-[#ef5350]/20'
                                                          : 'bg-muted hover:bg-muted/80 cursor-pointer border border-transparent'
                                                }`}
                                            >
                                                <div className='flex items-center gap-3'>
                                                    <input
                                                        type='radio'
                                                        name='plan'
                                                        value={plan.id}
                                                        checked={isSelected}
                                                        disabled={isDisabled}
                                                        onChange={(e) => {
                                                            const newPlanId =
                                                                e.target.value
                                                            setPlanId(newPlanId)
                                                            if (
                                                                !isLocationAvailableForPlan(
                                                                    location,
                                                                    newPlanId
                                                                )
                                                            ) {
                                                                setLocation(
                                                                    getFirstAvailableLocation(
                                                                        newPlanId
                                                                    )
                                                                )
                                                            }
                                                        }}
                                                        className='sr-only'
                                                    />
                                                    <div>
                                                        <p className='text-sm font-medium'>
                                                            {plan.name.replace(
                                                                /([A-Za-z])(\d)/,
                                                                '$1 $2'
                                                            )}
                                                        </p>
                                                        <p className='text-muted-foreground text-xs'>
                                                            {plan.cpu} vCPU /{' '}
                                                            {plan.memory} GB RAM
                                                            / {plan.disk} GB SSD
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className='text-sm font-semibold'>
                                                    $
                                                    {plan.priceMonthly.toFixed(
                                                        2
                                                    )}
                                                    /mo
                                                </span>
                                            </label>
                                        )

                                        const separator =
                                            tierLabel && index > 0 ? (
                                                <div
                                                    key={`tier-${plan.id}`}
                                                    className='pb-1 pt-4'
                                                >
                                                    <span className='text-muted-foreground text-xs font-semibold uppercase tracking-wider'>
                                                        {tierLabel}
                                                    </span>
                                                </div>
                                            ) : null

                                        if (isDisabled) {
                                            return (
                                                <>
                                                    {separator}
                                                    <Tooltip key={plan.id}>
                                                        <TooltipTrigger asChild>
                                                            <div>{card}</div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {t(
                                                                'createClaw.planUnavailable'
                                                            )}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )
                                        }

                                        return (
                                            <>
                                                {separator}
                                                <div key={plan.id}>{card}</div>
                                            </>
                                        )
                                    })}
                                </div>
                            </TooltipProvider>
                        )}
                    </div>

                    <div className='bg-muted/50 border-border rounded-lg border'>
                        <button
                            type='button'
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className='text-muted-foreground hover:text-foreground flex w-full items-center gap-2 p-4 text-sm transition-colors'
                        >
                            <CaretDownIcon
                                className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                            />
                            {t('createClaw.advancedOptions')}
                        </button>

                        {showAdvanced && (
                            <div className='border-border/50 space-y-5 border-t p-4'>
                                <div className='space-y-2'>
                                    <Label>
                                        {t('createClaw.rootPassword')}
                                    </Label>
                                    <div className='flex items-center gap-2'>
                                        <div className='relative flex-1'>
                                            <Input
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder={t(
                                                    'createClaw.rootPasswordPlaceholder'
                                                )}
                                                className='bg-muted pr-10 font-mono text-sm'
                                            />
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                        className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlashIcon className='h-4 w-4' />
                                                        ) : (
                                                            <EyeIcon className='h-4 w-4' />
                                                        )}
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {showPassword
                                                        ? t('common.hide')
                                                        : t('common.show')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            password
                                                        )
                                                        showToast(
                                                            t(
                                                                'createClaw.passwordCopied'
                                                            ),
                                                            'success'
                                                        )
                                                    }}
                                                >
                                                    <CopyIcon className='h-4 w-4' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {t('common.copy')}
                                            </TooltipContent>
                                        </Tooltip>
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() =>
                                                            setPassword(
                                                                generatePassword()
                                                            )
                                                        }
                                                    >
                                                        <ArrowClockwiseIcon className='h-4 w-4' />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {t(
                                                        'createClaw.regeneratePassword'
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className='text-muted-foreground text-xs'>
                                        {t(
                                            'createClaw.autoGeneratePasswordHint'
                                        )}
                                    </p>
                                </div>

                                <div className='space-y-2'>
                                    <Label>
                                        {t('createClaw.sshKeyOptional')}
                                    </Label>
                                    {sshKeys.length > 0 ? (
                                        <div className='space-y-2'>
                                            <label
                                                className={`flex cursor-pointer items-center rounded-lg p-3 transition ${
                                                    selectedSshKeyId === ''
                                                        ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                                                        : 'bg-muted hover:bg-muted/80 border border-transparent'
                                                }`}
                                            >
                                                <input
                                                    type='radio'
                                                    name='sshKey'
                                                    value=''
                                                    checked={
                                                        selectedSshKeyId === ''
                                                    }
                                                    onChange={() =>
                                                        setSelectedSshKeyId('')
                                                    }
                                                    className='sr-only'
                                                />
                                                <span className='text-sm'>
                                                    {t(
                                                        'createClaw.noSshKeyPasswordOnly'
                                                    )}
                                                </span>
                                            </label>
                                            {sshKeys.map((key) => (
                                                <label
                                                    key={key.id}
                                                    className={`flex cursor-pointer items-center rounded-lg p-3 transition ${
                                                        selectedSshKeyId ===
                                                        key.id
                                                            ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                                                            : 'bg-muted hover:bg-muted/80 border border-transparent'
                                                    }`}
                                                >
                                                    <input
                                                        type='radio'
                                                        name='sshKey'
                                                        value={key.id}
                                                        checked={
                                                            selectedSshKeyId ===
                                                            key.id
                                                        }
                                                        onChange={() =>
                                                            setSelectedSshKeyId(
                                                                key.id
                                                            )
                                                        }
                                                        className='sr-only'
                                                    />
                                                    <KeyIcon className='text-muted-foreground mr-3 h-4 w-4' />
                                                    <div>
                                                        <p className='text-sm font-medium'>
                                                            {key.name}
                                                        </p>
                                                        <p className='text-muted-foreground font-mono text-xs'>
                                                            {key.fingerprint}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='bg-muted flex items-center gap-3 rounded-lg p-3'>
                                            <div className='bg-background flex h-10 w-10 items-center justify-center rounded-full'>
                                                <KeyIcon className='text-muted-foreground h-5 w-5' />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium'>
                                                    {t(
                                                        'createClaw.noSshKeysConfigured'
                                                    )}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>
                                                    {t(
                                                        'createClaw.addSshKeyForPasswordlessLogin'
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                type='button'
                                                variant='secondary'
                                                size='sm'
                                                onClick={onNavigateToSSHKeys}
                                            >
                                                {t('common.addKey')}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {volumePricing && (
                                    <div className='space-y-2'>
                                        <Label>
                                            {t(
                                                'createClaw.additionalStorageOptional'
                                            )}
                                        </Label>
                                        <div
                                            className={`bg-muted space-y-4 rounded-lg p-4`}
                                        >
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <ClawMascot className='h-4 w-4' />
                                                    <span className='text-sm font-medium'>
                                                        {t(
                                                            'createClaw.volumeStorage'
                                                        )}
                                                    </span>
                                                </div>
                                                <span className='text-sm font-semibold'>
                                                    {volumeSize > 0
                                                        ? `+$${(volumeSize * volumePricing.pricePerGbMonthly).toFixed(2)}/mo`
                                                        : t('common.none')}
                                                </span>
                                            </div>
                                            <div className='space-y-3'>
                                                <Slider
                                                    value={[volumeSize]}
                                                    onValueChange={(value) =>
                                                        setVolumeSize(value[0])
                                                    }
                                                    min={0}
                                                    max={500}
                                                    step={10}
                                                />
                                                <div className='flex items-center justify-between'>
                                                    <span className='text-muted-foreground text-xs'>
                                                        0 GB
                                                    </span>
                                                    <div className='flex items-center gap-2'>
                                                        <Input
                                                            type='number'
                                                            min={0}
                                                            max={
                                                                volumePricing.maxSize
                                                            }
                                                            value={volumeSize}
                                                            onChange={(e) => {
                                                                const val =
                                                                    Math.min(
                                                                        Math.max(
                                                                            0,
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        ),
                                                                        volumePricing.maxSize
                                                                    )
                                                                setVolumeSize(
                                                                    val
                                                                )
                                                            }}
                                                            className='h-8 w-20 text-center text-sm'
                                                        />
                                                        <span className='text-muted-foreground text-sm'>
                                                            GB
                                                        </span>
                                                    </div>
                                                    <span className='text-muted-foreground text-xs'>
                                                        500 GB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedPlan && (
                        <div className='bg-muted space-y-2 rounded-lg p-4'>
                            {name && (
                                <div className='flex justify-between text-sm'>
                                    <span className='text-muted-foreground'>
                                        {t('createClaw.clawName')}
                                    </span>
                                    <span>{name}</span>
                                </div>
                            )}
                            {location && (
                                <div className='flex justify-between text-sm'>
                                    <span className='text-muted-foreground'>
                                        {t('createClaw.location')}
                                    </span>
                                    <span>
                                        {locations.find(
                                            (l) => l.id === location
                                        )?.city || location}
                                    </span>
                                </div>
                            )}
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    {selectedPlan.name.replace(
                                        /([A-Za-z])(\d)/,
                                        '$1 $2'
                                    )}
                                </span>
                                <span>
                                    ${selectedPlan.priceMonthly.toFixed(2)}/mo
                                </span>
                            </div>
                            {volumeSize > 0 && volumePricing && (
                                <div className='flex justify-between text-sm'>
                                    <span className='text-muted-foreground'>
                                        {t('createClaw.storageWithSize')} (
                                        {volumeSize} GB)
                                    </span>
                                    <span>
                                        +$
                                        {(
                                            volumeSize *
                                            volumePricing.pricePerGbMonthly
                                        ).toFixed(2)}
                                        /mo
                                    </span>
                                </div>
                            )}
                            <div className='border-border flex justify-between border-t pt-2 text-sm'>
                                <span className='text-muted-foreground'>
                                    {t('createClaw.totalMonthly')}
                                </span>
                                <span className='font-semibold'>
                                    $
                                    {(
                                        selectedPlan.priceMonthly +
                                        (volumeSize > 0 && volumePricing
                                            ? volumeSize *
                                              volumePricing.pricePerGbMonthly
                                            : 0)
                                    ).toFixed(2)}
                                    /mo
                                </span>
                            </div>
                        </div>
                    )}

                    <div className='flex justify-end gap-3'>
                        <Button type='button' variant='ghost' onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type='submit'
                            disabled={
                                purchaseMutation.isPending ||
                                !selectedPlan ||
                                !location
                            }
                        >
                            {purchaseMutation.isPending && (
                                <CircleNotchIcon className='h-4 w-4 animate-spin' />
                            )}
                            {!selectedPlan
                                ? t('createClaw.selectServerToContinue')
                                : !location
                                  ? t('createClaw.selectLocationToContinue')
                                  : t('createClaw.proceedToPayment', {
                                        amount: (
                                            selectedPlan.priceMonthly +
                                            (volumeSize > 0 && volumePricing
                                                ? volumeSize *
                                                  volumePricing.pricePerGbMonthly
                                                : 0)
                                        ).toFixed(2)
                                    })}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateClawModal
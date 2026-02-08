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
import { generatePassword, locationFlags, aiModels } from '@/lib/claw-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectGroup
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    CircleNotch,
    Eye,
    EyeSlash,
    Key,
    Copy,
    ArrowClockwise,
    CaretDown
} from '@phosphor-icons/react'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { ClawMascot } from '@/components/ClawMascot'

const CreateClawModal: FC<CreateClawModalProps> = ({
    plans: initialPlans,
    locations: initialLocations,
    sshKeys,
    volumePricing: initialVolumePricing,
    planAvailability: initialPlanAvailability,
    preselectedPlanId,
    onClose,
    onNavigateToSSHKeys
}): ReactNode => {
    const [name, setName] = useState('')
    const [provider, setProvider] = useState<ProviderType>('hetzner')

    const { data: providerPlans, isLoading: isLoadingPlans } = usePlans(provider)
    const { data: providerLocations, isLoading: isLoadingLocations } = useLocations(provider)
    const { data: providerVolumePricing } = useVolumePricing(provider)
    const { data: providerPlanAvailability } = usePlanAvailability(provider)

    const isProviderLoading = isLoadingPlans || isLoadingLocations
    const plans = providerPlans || initialPlans
    const locations = providerLocations || initialLocations
    const volumePricing = providerVolumePricing || initialVolumePricing
    const planAvailability = providerPlanAvailability || initialPlanAvailability

    const initialPlanId =
        preselectedPlanId && plans.find((p) => p.id === preselectedPlanId)
            ? preselectedPlanId
            : plans[0]?.id || ''
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
    const [model, setModel] = useState('')
    const [apiToken, setApiToken] = useState('')
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
            const firstPlan = plans[0].id
            setPlanId(firstPlan)
            setLocation(getFirstAvailableLocation(firstPlan))
        }
    }, [plans, locations])

    useEffect(() => {
        if (planId && planAvailability) {
            const currentAvailable = isLocationAvailableForPlan(location, planId)
            const currentDisabled = locations.find((l) => l.id === location)?.disabled
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
                model: model || undefined,
                apiToken: apiToken || undefined,
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

    const selectedPlan = plans.find((p) => p.id === planId)

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
                            <span className='text-red-400'> *</span>
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
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.location')}
                            <span className='text-red-400'> *</span>
                        </Label>
                        {isProviderLoading ? (
                            <div className='grid grid-cols-2 gap-2'>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className='h-10 rounded-lg' />
                                ))}
                            </div>
                        ) : (
                        <TooltipProvider delayDuration={200}>
                            <div className='grid grid-cols-2 gap-2'>
                                {locations.map((loc) => {
                                    const isSelected = location === loc.id
                                    const locFlag = locationFlags[loc.id] || ''
                                    const unavailableForPlan =
                                        !isLocationAvailableForPlan(
                                            loc.id,
                                            planId
                                        )
                                    const isDisabled =
                                        loc.disabled || unavailableForPlan
                                    const locationLabel = loc.country
                                        ? `${loc.city}, ${loc.country}`
                                        : loc.city

                                    const tooltipText = loc.disabled
                                        ? t('createClaw.locationUnavailable')
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
                                                    setLocation(e.target.value)
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

                                    return (
                                        <div key={loc.id}>{card}</div>
                                    )
                                })}
                            </div>
                        </TooltipProvider>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.plan')}
                            <span className='text-red-400'> *</span>
                        </Label>
                        {isProviderLoading ? (
                            <div className='space-y-2'>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className='h-14 rounded-lg' />
                                ))}
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                {plans.map((plan) => {
                                    const isSelected = planId === plan.id
                                    return (
                                        <label
                                            key={plan.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition ${
                                                isSelected
                                                    ? 'border border-[#ef5350]/50 bg-[#ef5350]/20'
                                                    : 'bg-muted hover:bg-muted/80 border border-transparent'
                                            }`}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <input
                                                    type='radio'
                                                    name='plan'
                                                    value={plan.id}
                                                    checked={isSelected}
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
                                                        {plan.name.replace(/([A-Za-z])(\d)/, '$1 $2')}
                                                    </p>
                                                    <p className='text-muted-foreground text-xs'>
                                                        {plan.cpu} vCPU /{' '}
                                                        {plan.memory} GB RAM /{' '}
                                                        {plan.disk} GB SSD
                                                    </p>
                                                </div>
                                            </div>
                                            <span className='text-sm font-semibold'>
                                                ${plan.priceMonthly.toFixed(2)}/mo
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label>{t('createClaw.model')}</Label>
                        <Select value={model} onValueChange={setModel}>
                            <SelectTrigger
                                placeholder={t('createClaw.modelNone')}
                            />
                            <SelectContent>
                                <SelectItem value=''>
                                    {t('createClaw.modelNone')}
                                </SelectItem>
                                {Object.entries(
                                    aiModels.reduce<
                                        Record<string, typeof aiModels>
                                    >((groups, m) => {
                                        const group = groups[m.provider] || []
                                        group.push(m)
                                        groups[m.provider] = group
                                        return groups
                                    }, {})
                                ).map(([provider, models], idx, arr) => (
                                    <SelectGroup
                                        key={provider}
                                        label={provider}
                                        isLast={idx === arr.length - 1}
                                    >
                                        {models.map((m) => (
                                            <SelectItem key={m.id} value={m.id}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className='text-muted-foreground text-xs'>
                            {t('createClaw.modelDescription')}
                        </p>
                    </div>

                    {model && (
                        <div className='space-y-2'>
                            <Label>{t('createClaw.apiToken')}</Label>
                            <Input
                                type='password'
                                value={apiToken}
                                onChange={(e) => setApiToken(e.target.value)}
                                placeholder={t(
                                    'createClaw.apiTokenPlaceholder'
                                )}
                                className='h-11 font-mono text-sm'
                            />
                            <p className='text-muted-foreground text-xs'>
                                {t('createClaw.apiTokenDescription')}
                            </p>
                        </div>
                    )}

                    <button
                        type='button'
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors'
                    >
                        <CaretDown
                            className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        />
                        {t('createClaw.advancedOptions')}
                    </button>

                    {showAdvanced && (
                        <div className='space-y-5 pt-2'>
                            <div className='space-y-2'>
                                <Label>{t('createClaw.rootPassword')}</Label>
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
                                            className='pr-10 font-mono text-sm'
                                        />
                                        <button
                                            type='button'
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                                        >
                                            {showPassword ? (
                                                <EyeSlash className='h-4 w-4' />
                                            ) : (
                                                <Eye className='h-4 w-4' />
                                            )}
                                        </button>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                password
                                            )
                                            showToast(
                                                t('createClaw.passwordCopied'),
                                                'success'
                                            )
                                        }}
                                    >
                                        <Copy className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                            setPassword(generatePassword())
                                        }
                                    >
                                        <ArrowClockwise className='h-4 w-4' />
                                    </Button>
                                </div>
                                <p className='text-muted-foreground text-xs'>
                                    {t('createClaw.autoGeneratePasswordHint')}
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <Label>{t('createClaw.sshKeyOptional')}</Label>
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
                                                    selectedSshKeyId === key.id
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
                                                <Key className='text-muted-foreground mr-3 h-4 w-4' />
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
                                            <Key className='text-muted-foreground h-5 w-5' />
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
                                                            setVolumeSize(val)
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
                                    {selectedPlan.name.replace(/([A-Za-z])(\d)/, '$1 $2')}
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
                            disabled={purchaseMutation.isPending || !planId || !location}
                        >
                            {purchaseMutation.isPending ? (
                                <>
                                    <CircleNotch className='h-4 w-4 animate-spin' />
                                    {t('createClaw.redirecting')}
                                </>
                            ) : (
                                t('createClaw.proceedToPayment', {
                                    amount: (
                                        (selectedPlan?.priceMonthly ?? 0) +
                                        (volumeSize > 0 && volumePricing
                                            ? volumeSize *
                                              volumePricing.pricePerGbMonthly
                                            : 0)
                                    ).toFixed(2)
                                })
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export { CreateClawModal }
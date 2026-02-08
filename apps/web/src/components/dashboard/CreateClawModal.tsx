import type { FC, ReactNode } from 'react'
import type { CreateClawModalProps } from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { useUIStore } from '@/lib/store'
import { usePurchaseClaw } from '@/hooks'
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
import { ClawMascot } from '@/components/ClawMascot'

const CreateClawModal: FC<CreateClawModalProps> = ({
    plans,
    locations,
    sshKeys,
    volumePricing,
    planAvailability,
    preselectedPlanId,
    onClose,
    onNavigateToSSHKeys
}): ReactNode => {
    const [name, setName] = useState('')
    const initialPlanId =
        preselectedPlanId && plans.find((p) => p.id === preselectedPlanId)
            ? preselectedPlanId
            : plans[0]?.id || ''
    const [planId, setPlanId] = useState(initialPlanId)

    const isLocationAvailableForPlan = (locationId: string, selectedPlanId: string): boolean => {
        if (!planAvailability) return true
        const available = planAvailability[selectedPlanId]
        if (!available) return true
        return available.includes(locationId)
    }

    const getFirstAvailableLocation = (selectedPlanId: string): string => {
        const available = locations.find(
            (l) => !l.disabled && isLocationAvailableForPlan(l.id, selectedPlanId)
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
    const [provider, setProvider] = useState('hetzner')
    const [showAdvanced, setShowAdvanced] = useState(false)
    const { showToast } = useUIStore()

    const purchaseMutation = usePurchaseClaw()

    const handleCreate = () => {
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
                                onClick={() => setProvider('hetzner')}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                    provider === 'hetzner'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <svg className='h-4 w-4' viewBox='0 0 63 64' fill='none'>
                                    <rect width='63' height='64' rx='31.5' fill='#D50C2D' />
                                    <path d='M48.3772 14H43.4235C42.3132 14 41.8434 14.465 41.8434 15.564V27.9493H22.1566V15.564C22.1566 14.465 21.6868 14 20.5765 14H15.5801C14.4697 14 14 14.465 14 15.564V47.436C14 48.535 14.4697 49 15.5801 49H20.5765C21.6868 49 22.1566 48.5773 22.1566 47.436V34.8394H41.8861V47.436C41.8861 48.535 42.3559 49 43.4662 49H48.4199C49.5302 49 50 48.535 50 47.436V15.564C49.9573 14.5072 49.4875 14 48.3772 14Z' fill='white' />
                                </svg>
                                {t('createClaw.providerHetzner')}
                            </button>
                            <button
                                type='button'
                                disabled
                                className='text-muted-foreground flex cursor-not-allowed items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium opacity-50'
                            >
                                <svg className='h-4 w-4' viewBox='0 0 512 512' fill='none'>
                                    <path d='M78 373v-47h47v104h57V300h74v147A191 191 0 1065 256h74a117 117 0 11117 117' fill='#0080FF' />
                                </svg>
                                {t('createClaw.providerDigitalOcean')}
                                <span className='bg-muted-foreground/20 rounded px-1.5 py-0.5 text-xs'>
                                    {t('createClaw.comingSoon')}
                                </span>
                            </button>
                            <button
                                type='button'
                                disabled
                                className='text-muted-foreground flex cursor-not-allowed items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium opacity-50'
                            >
                                <svg className='h-4 w-4' viewBox='0 0 16 16' fill='none'>
                                    <path fill='#252F3E' d='M4.51 7.687c0 .197.02.357.058.475.042.117.096.245.17.384a.233.233 0 01.037.123c0 .053-.032.107-.1.16l-.336.224a.255.255 0 01-.138.048c-.054 0-.107-.026-.16-.074a1.652 1.652 0 01-.192-.251 4.137 4.137 0 01-.165-.315c-.415.491-.936.737-1.564.737-.447 0-.804-.129-1.064-.385-.261-.256-.394-.598-.394-1.025 0-.454.16-.822.484-1.1.325-.278.756-.416 1.304-.416.18 0 .367.016.564.042.197.027.4.07.612.118v-.39c0-.406-.085-.689-.25-.854-.17-.166-.458-.246-.868-.246-.186 0-.377.022-.574.07a4.23 4.23 0 00-.575.181 1.525 1.525 0 01-.186.07.326.326 0 01-.085.016c-.075 0-.112-.054-.112-.166v-.262c0-.085.01-.15.037-.186a.399.399 0 01.15-.113c.185-.096.409-.176.67-.24.26-.07.537-.101.83-.101.633 0 1.096.144 1.394.432.293.288.442.726.442 1.314v1.73h.01zm-2.161.811c.175 0 .356-.032.548-.096.191-.064.362-.182.505-.342a.848.848 0 00.181-.341c.032-.129.054-.283.054-.465V7.03a4.43 4.43 0 00-.49-.09 3.996 3.996 0 00-.5-.033c-.357 0-.618.07-.793.214-.176.144-.26.347-.26.614 0 .25.063.437.196.566.128.133.314.197.559.197zm4.273.577c-.096 0-.16-.016-.202-.054-.043-.032-.08-.106-.112-.208l-1.25-4.127a.938.938 0 01-.049-.214c0-.085.043-.133.128-.133h.522c.1 0 .17.016.207.053.043.032.075.107.107.208l.894 3.535.83-3.535c.026-.106.058-.176.1-.208a.365.365 0 01.214-.053h.425c.102 0 .17.016.213.053.043.032.08.107.101.208l.841 3.578.92-3.578a.458.458 0 01.107-.208.346.346 0 01.208-.053h.495c.085 0 .133.043.133.133 0 .027-.006.054-.01.086a.76.76 0 01-.038.133l-1.283 4.127c-.032.107-.069.177-.111.209a.34.34 0 01-.203.053h-.457c-.101 0-.17-.016-.213-.053-.043-.038-.08-.107-.101-.214L8.213 5.37l-.82 3.439c-.026.107-.058.176-.1.213-.043.038-.118.054-.213.054h-.458zm6.838.144a3.51 3.51 0 01-.82-.096c-.266-.064-.473-.134-.612-.214-.085-.048-.143-.101-.165-.15a.378.378 0 01-.031-.149v-.272c0-.112.042-.166.122-.166a.3.3 0 01.096.016c.032.011.08.032.133.054.18.08.378.144.585.187.213.042.42.064.633.064.336 0 .596-.059.777-.176a.575.575 0 00.277-.508.52.52 0 00-.144-.373c-.095-.102-.276-.193-.537-.278l-.772-.24c-.388-.123-.676-.305-.851-.545a1.275 1.275 0 01-.266-.774c0-.224.048-.422.143-.593.096-.17.224-.32.384-.438.16-.122.34-.213.553-.277.213-.064.436-.091.67-.091.118 0 .24.005.357.021.122.016.234.038.346.06.106.026.208.052.303.085.096.032.17.064.224.096a.46.46 0 01.16.133.289.289 0 01.047.176v.251c0 .112-.042.171-.122.171a.552.552 0 01-.202-.064 2.427 2.427 0 00-1.022-.208c-.303 0-.543.048-.708.15-.165.1-.25.256-.25.475 0 .149.053.277.16.379.106.101.303.202.585.293l.756.24c.383.123.66.294.825.513.165.219.244.47.244.748 0 .23-.047.437-.138.619a1.436 1.436 0 01-.388.47c-.165.133-.362.23-.591.299-.24.075-.49.112-.761.112z' />
                                    <path fill='#F90' fillRule='evenodd' clipRule='evenodd' d='M14.465 11.813c-1.75 1.297-4.294 1.986-6.481 1.986-3.065 0-5.827-1.137-7.913-3.027-.165-.15-.016-.353.18-.235 2.257 1.313 5.04 2.109 7.92 2.109 1.941 0 4.075-.406 6.039-1.239.293-.133.543.192.255.406z' />
                                    <path fill='#F90' fillRule='evenodd' clipRule='evenodd' d='M15.194 10.98c-.223-.287-1.479-.138-2.048-.069-.17.022-.197-.128-.043-.24 1-.705 2.645-.502 2.836-.267.192.24-.053 1.89-.99 2.68-.143.123-.281.06-.218-.1.213-.53.687-1.72.463-2.003z' />
                                </svg>
                                {t('createClaw.providerAws')}
                                <span className='bg-muted-foreground/20 rounded px-1.5 py-0.5 text-xs'>
                                    {t('createClaw.comingSoon')}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.location')}
                            <span className='text-red-400'> *</span>
                        </Label>
                        <div className='grid grid-cols-2 gap-2'>
                            {locations.map((loc) => {
                                const isSelected = location === loc.id
                                const locFlag = locationFlags[loc.id] || ''
                                const unavailableForPlan = !isLocationAvailableForPlan(loc.id, planId)
                                const isDisabled = loc.disabled || unavailableForPlan
                                return (
                                    <label
                                        key={loc.id}
                                        className={`flex items-center gap-2 rounded-lg p-3 transition ${
                                            isDisabled
                                                ? 'bg-muted/50 cursor-not-allowed border border-transparent opacity-80'
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
                                        <div>
                                            <p className='text-sm font-medium'>
                                                {loc.city}, {loc.country}
                                            </p>
                                            {loc.disabled && (
                                                <p className='text-muted-foreground text-xs'>
                                                    {t(
                                                        'createClaw.locationUnavailable'
                                                    )}
                                                </p>
                                            )}
                                            {!loc.disabled && unavailableForPlan && (
                                                <p className='text-muted-foreground text-xs'>
                                                    {t(
                                                        'createClaw.locationUnavailableForPlan'
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>
                            {t('createClaw.plan')}
                            <span className='text-red-400'> *</span>
                        </Label>
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
                                                    const newPlanId = e.target.value
                                                    setPlanId(newPlanId)
                                                    if (!isLocationAvailableForPlan(location, newPlanId)) {
                                                        setLocation(getFirstAvailableLocation(newPlanId))
                                                    }
                                                }}
                                                className='sr-only'
                                            />
                                            <div>
                                                <p className='text-sm font-medium'>
                                                    {plan.name}
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
                                ).map(([provider, models]) => (
                                    <SelectGroup
                                        key={provider}
                                        label={provider}
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
                                    {selectedPlan.name}
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
                            disabled={purchaseMutation.isPending}
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
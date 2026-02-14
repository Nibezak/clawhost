import type { FC, ReactNode } from 'react'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useUIStore } from '@/lib/store'
import { useProfile, useUpdateProfile, useUserStats } from '@/hooks'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/Header'
import { LandingFooter } from '@/components/LandingFooter'
import { PageBackground } from '@/components/PageBackground'
import { PageTitle } from '@/components/PageTitle'
import { CircleNotch, Calendar, Key } from '@phosphor-icons/react'
import { ClawMascotOutline } from '@/components/ClawMascotOutline'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

const Account: FC = (): ReactNode => {
    const { user, loading: authLoading, updateCachedProfile } = useAuth()
    const { showToast } = useUIStore()

    const [name, setName] = useState('')
    const [hasChanges, setHasChanges] = useState(false)

    const { data: profile } = useProfile({ enabled: !!user })
    const { data: userStats } = useUserStats()

    useEffect(() => {
        if (profile?.name) {
            setName(profile.name)
        }
    }, [profile?.name])

    const updateMutation = useUpdateProfile()

    const handleSave = () => {
        updateMutation.mutate(
            { name },
            {
                onSuccess: (data) => {
                    setName(data.name || '')
                    setHasChanges(false)
                    updateCachedProfile({ name: data.name })
                    showToast(
                        t('account.profileUpdatedSuccessfully'),
                        'success'
                    )
                },
                onError: (err: Error) => {
                    showToast(
                        err.message || t('errors.failedToUpdateProfile'),
                        'error'
                    )
                }
            }
        )
    }

    const handleNameChange = (value: string) => {
        setName(value)
        setHasChanges(value !== (profile?.name || ''))
    }

    const email = user?.email || ''
    const displayName = name || profile?.name || email

    const getInitials = (text: string) => {
        if (!text) return '?'
        const parts = text.split(' ')
        if (parts.length > 1) {
            return (
                parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
            ).toUpperCase()
        }
        return text.charAt(0).toUpperCase()
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '...'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const joinedDate = user?.metadata?.creationTime

    return (
        <div className='relative flex min-h-screen flex-col bg-[#0a0a0f] text-white'>
            <PageTitle
                title={t('account.title')}
                description={t('account.description')}
            />
            <PageBackground />
            <Header />

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='relative mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-8'
            >
                {authLoading || !profile ? (
                    <div className='flex min-h-[60vh] items-center justify-center'>
                        <CircleNotch className='text-primary h-8 w-8 animate-spin' />
                    </div>
                ) : (
                    <>
                        <PageHeader
                            title={t('account.accountSettings')}
                            description={t('account.manageYourAccount')}
                        />

                        <div className='rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm'>
                            <h3 className='mb-1 font-semibold'>
                                {t('account.profileInformation')}
                            </h3>
                            <p className='text-muted-foreground mb-6 text-sm'>
                                {t('account.profileDescription')}
                            </p>

                            <div className='mb-8 flex items-start gap-6'>
                                <Avatar className='h-20 w-20'>
                                    <AvatarFallback className='bg-gradient-to-br from-[#ef5350] to-[#c62828] text-4xl font-semibold text-white'>
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1 space-y-2'>
                                    <div>
                                        <p className='text-lg font-medium'>
                                            {name ||
                                                profile?.name ||
                                                t('account.noNameSet')}
                                        </p>
                                        <p className='text-muted-foreground text-sm'>
                                            {email}
                                        </p>
                                    </div>
                                    <div className='text-muted-foreground flex items-center gap-6 text-sm'>
                                        <div className='flex items-center gap-1.5'>
                                            <Calendar className='h-4 w-4' />
                                            <span>
                                                {t('account.joined')}{' '}
                                                {formatDate(joinedDate)}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <ClawMascotOutline className='h-4 w-4' />
                                            <span>
                                                {userStats?.clawCount ?? 0}{' '}
                                                {t('account.claws')}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <Key className='h-4 w-4' />
                                            <span>
                                                {userStats?.sshKeyCount ?? 0}{' '}
                                                {t('account.sshKeys')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='max-w-xs space-y-2'>
                                    <Label htmlFor='name'>
                                        {t('account.displayName')}
                                    </Label>
                                    <Input
                                        id='name'
                                        type='text'
                                        value={name}
                                        onChange={(e) =>
                                            handleNameChange(e.target.value)
                                        }
                                        placeholder={t('account.enterYourName')}
                                        maxLength={100}
                                    />
                                </div>

                                <div className='flex justify-end pt-6'>
                                    <Button
                                        onClick={handleSave}
                                        disabled={
                                            !hasChanges ||
                                            updateMutation.isPending
                                        }
                                    >
                                        {updateMutation.isPending && (
                                            <CircleNotch className='h-4 w-4 animate-spin' />
                                        )}
                                        {t('common.save')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </motion.main>

            <LandingFooter />
        </div>
    )
}

export default Account
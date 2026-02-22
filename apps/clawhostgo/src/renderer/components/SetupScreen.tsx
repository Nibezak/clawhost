import type { FC, ReactNode } from 'react'
import type { SetupScreenProps } from '@/ts/Interfaces'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import { Logo, LanguageSelector, ThemeToggle } from '@/components'
import { Input, Label, Button } from '@/components/ui'
import { CircleNotchIcon } from '@phosphor-icons/react'

const SetupScreen: FC<SetupScreenProps> = ({ onComplete }): ReactNode => {
    const { updateCachedProfile } = useAuth()
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)

    const handleSubmit = async () => {
        if (saving) return
        const finalName = name.trim()
        setSaving(true)
        try {
            await api.updateProfile({ name: finalName })
            updateCachedProfile({ name: finalName })
            onComplete()
        } catch {
            setSaving(false)
        }
    }

    return (
        <div className='bg-background text-foreground fixed inset-0 flex flex-col overflow-hidden'>
            <div className='playground-grid pointer-events-none fixed inset-0 opacity-50' />
            <div className='playground-gradient pointer-events-none fixed inset-0 opacity-30' />
            <div className='border-border bg-background relative z-10 flex items-center justify-between border-b px-6 py-3'>
                <Logo />
                <div className='flex items-center gap-1.5 sm:gap-3'>
                    <LanguageSelector />
                    <ThemeToggle />
                </div>
            </div>
            <div className='relative z-10 flex flex-1 items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='w-full max-w-sm px-6'
                >
                    <div className='mb-8 text-center'>
                        <h1 className='font-clash text-2xl font-semibold'>
                            {t('setup.welcomeTitle')}
                        </h1>
                        <p className='text-muted-foreground mt-2 text-sm'>
                            {t('setup.welcomeDescription')}
                        </p>
                    </div>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='setup-name'>
                                {t('setup.whatsYourName')}
                            </Label>
                            <Input
                                id='setup-name'
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSubmit()
                                }}
                                placeholder={t('setup.namePlaceholder')}
                                maxLength={100}
                                autoFocus
                            />
                            <p className='text-muted-foreground text-xs'>
                                {t('setup.nameHint')}
                            </p>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={saving}
                            className='w-full'
                        >
                            {saving && (
                                <CircleNotchIcon className='h-4 w-4 animate-spin' />
                            )}
                            {t('setup.getStarted')}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default SetupScreen
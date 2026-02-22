import type { FC, ReactNode } from 'react'
import type { LocalCreateClawModalProps } from '@/ts/Interfaces'

import { useState } from 'react'
import { t } from '@openclaw/i18n'
import { clawProvider } from '@openclaw/shared'
import { useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '@/lib/store'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CircleNotchIcon } from '@phosphor-icons/react'
import { api } from '@/lib'

const LocalCreateClawModal: FC<LocalCreateClawModalProps> = ({
    onClose
}): ReactNode => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const queryClient = useQueryClient()
    const showToast = useUIStore((s) => s.showToast)

    const nameValid = /^[a-zA-Z0-9-]+$/.test(name) && name.length > 0

    const handleCreate = async (): Promise<void> => {
        if (!nameValid) {
            setError(t('createClaw.clawNameInvalidChars'))
            return
        }

        setLoading(true)
        setError('')

        try {
            await api.createClaw({
                name,
                provider: clawProvider.local as never,
                planId: clawProvider.local,
                location: clawProvider.local
            })
            await queryClient.invalidateQueries({ queryKey: ['claws'] })
            showToast(t('createClaw.clawCreated'), 'success')
            onClose()
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : t('errors.somethingWentWrong')
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
        >
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('createClaw.title')}</DialogTitle>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <Label>{t('createClaw.clawName')}</Label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                setError('')
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === 'Enter' &&
                                    nameValid &&
                                    !loading
                                ) {
                                    handleCreate()
                                }
                            }}
                            placeholder={t('createClaw.clawNamePlaceholder')}
                            autoFocus
                        />
                        <p className='text-muted-foreground text-xs'>
                            {t('createClaw.clawNameInvalidChars')}
                        </p>
                    </div>

                    {error && <p className='text-sm text-red-400'>{error}</p>}
                </div>

                <DialogFooter>
                    <Button
                        variant='ghost'
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!nameValid || loading}
                    >
                        {loading && (
                            <CircleNotchIcon className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {loading
                            ? t('createClaw.creating')
                            : t('createClaw.title')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LocalCreateClawModal
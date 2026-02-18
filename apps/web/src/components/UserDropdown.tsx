import type { FC, ReactNode } from 'react'
import type { UserDropdownProps } from '@/ts/Interfaces'

import { useNavigate, useLocation } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { ROUTES } from '@/lib'
import {
    Button,
    Avatar,
    AvatarFallback,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui'
import { ClawMascotOutline } from '@/components'
import {
    KeyIcon,
    UserIcon,
    SignOutIcon,
    ReceiptIcon
} from '@phosphor-icons/react'

const UserDropdown: FC<UserDropdownProps> = ({
    displayName,
    onSignOut,
    onOpen
}): ReactNode => {
    const navigate = useNavigate()
    const location = useLocation()

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

    const handleOpenChange = (open: boolean) => {
        if (open && onOpen) onOpen()
    }

    return (
        <DropdownMenu modal={false} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    size='sm'
                    className='hover:bg-foreground/10 flex w-auto items-center gap-2 px-1.5 py-[18px]'
                >
                    <Avatar className='h-7 w-7'>
                        <AvatarFallback className='bg-gradient-to-br from-[#ef5350] to-[#c62828] text-xs text-white'>
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                    <span className='text-foreground/80 hidden max-w-[120px] truncate text-sm sm:block'>
                        {displayName}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='border-border bg-popover w-56'
            >
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.CLAWS)}
                    className={`text-foreground/80 focus:bg-foreground/10 focus:text-foreground ${location.pathname === ROUTES.CLAWS ? 'bg-foreground/10' : ''}`}
                >
                    <ClawMascotOutline className='h-4 w-4' />
                    {t('nav.claws')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.SSH_KEYS)}
                    className={`text-foreground/80 focus:bg-foreground/10 focus:text-foreground ${location.pathname === ROUTES.SSH_KEYS ? 'bg-foreground/10' : ''}`}
                >
                    <KeyIcon className='h-4 w-4' />
                    {t('nav.sshKeys')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.ACCOUNT)}
                    className={`text-foreground/80 focus:bg-foreground/10 focus:text-foreground ${location.pathname === ROUTES.ACCOUNT ? 'bg-foreground/10' : ''}`}
                >
                    <UserIcon className='h-4 w-4' />
                    {t('nav.account')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.BILLING)}
                    className={`text-foreground/80 focus:bg-foreground/10 focus:text-foreground ${location.pathname === ROUTES.BILLING ? 'bg-foreground/10' : ''}`}
                >
                    <ReceiptIcon className='h-4 w-4' />
                    {t('nav.billing')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-border' />
                <DropdownMenuItem
                    onClick={onSignOut}
                    className='focus:bg-foreground/10 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400'
                >
                    <SignOutIcon className='h-4 w-4' />
                    {t('nav.signOut')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
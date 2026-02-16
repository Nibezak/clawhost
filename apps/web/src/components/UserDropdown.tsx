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
import { Key, User, SignOut, Receipt } from '@phosphor-icons/react'

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
                    className='flex w-auto items-center gap-2 px-1.5 py-[18px] hover:bg-white/10'
                >
                    <Avatar className='h-7 w-7'>
                        <AvatarFallback className='bg-gradient-to-br from-[#ef5350] to-[#c62828] text-xs text-white'>
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                    <span className='hidden max-w-[120px] truncate text-sm text-gray-300 sm:block'>
                        {displayName}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='w-56 border-white/10 bg-[#151518]'
            >
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.CLAWS)}
                    className={`text-gray-300 focus:bg-white/10 focus:text-white ${location.pathname === ROUTES.CLAWS ? 'bg-white/10' : ''}`}
                >
                    <ClawMascotOutline className='h-4 w-4' />
                    {t('nav.claws')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.SSH_KEYS)}
                    className={`text-gray-300 focus:bg-white/10 focus:text-white ${location.pathname === ROUTES.SSH_KEYS ? 'bg-white/10' : ''}`}
                >
                    <Key className='h-4 w-4' />
                    {t('nav.sshKeys')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.ACCOUNT)}
                    className={`text-gray-300 focus:bg-white/10 focus:text-white ${location.pathname === ROUTES.ACCOUNT ? 'bg-white/10' : ''}`}
                >
                    <User className='h-4 w-4' />
                    {t('nav.account')}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => navigate(ROUTES.BILLING)}
                    className={`text-gray-300 focus:bg-white/10 focus:text-white ${location.pathname === ROUTES.BILLING ? 'bg-white/10' : ''}`}
                >
                    <Receipt className='h-4 w-4' />
                    {t('nav.billing')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-white/10' />
                <DropdownMenuItem
                    onClick={onSignOut}
                    className='text-red-400 focus:bg-white/10 focus:text-red-400'
                >
                    <SignOut className='h-4 w-4' />
                    {t('nav.signOut')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
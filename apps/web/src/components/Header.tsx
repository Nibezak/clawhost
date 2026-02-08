import type { FC, ReactNode } from 'react'
import type { HeaderProps } from '@/ts/Interfaces'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { t } from '@openclaw/i18n'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/Logo'
import { ROUTES } from '@/lib/routes'
import { Key, User, SignOut, Lightning } from '@phosphor-icons/react'
import { ClawMascot } from '@/components/ClawMascot'

const Header: FC<HeaderProps> = ({
    showNavLinks = false,
    navLinks = [],
    activeSection = ''
}): ReactNode => {
    const { user, loading: authLoading, cachedProfile, signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const { data: profile } = useProfile({
        enabled: !!user,
        staleTime: 1000 * 60 * 5
    })

    const displayName =
        profile?.name ||
        cachedProfile?.name ||
        user?.email ||
        cachedProfile?.email ||
        ''

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

    const isLandingPage = location.pathname === '/'

    return (
        <header
            className={`${isLandingPage ? 'fixed' : 'relative'} left-0 right-0 top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl'
                    : 'border-b border-transparent bg-transparent'
            }`}
        >
            <div className='mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4'>
                <Logo />

                {showNavLinks && navLinks.length > 0 ? (
                    <nav className='hidden items-center justify-center gap-6 md:flex'>
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition ${
                                    activeSection === link.id
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                ) : (
                    <div />
                )}

                <div className='flex items-center gap-3'>
                    {authLoading && !cachedProfile ? (
                        <Button
                            variant='ghost'
                            size='sm'
                            className='pointer-events-none flex min-w-[100px] items-center justify-start gap-2 px-1.5 py-5'
                        >
                            <Skeleton className='h-7 w-7 shrink-0 rounded-full bg-white/10' />
                            <Skeleton className='hidden h-4 w-16 rounded bg-white/10 sm:block' />
                        </Button>
                    ) : user || cachedProfile ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='flex min-w-[100px] items-center justify-start gap-2 px-1.5 py-5 hover:bg-white/10'
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
                                    <ClawMascot className='h-4 w-4' />
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
                                <DropdownMenuSeparator className='bg-white/10' />
                                <DropdownMenuItem
                                    onClick={signOut}
                                    className='text-red-400 focus:bg-white/10 focus:text-red-400'
                                >
                                    <SignOut className='h-4 w-4' />
                                    {t('nav.signOut')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Link
                                to={ROUTES.LOGIN}
                                className='hidden px-3 py-1.5 text-sm text-gray-400 transition hover:text-white sm:block'
                            >
                                {t('nav.login')}
                            </Link>
                            <Button
                                size='lg'
                                className='gap-2 border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] px-4 text-white hover:opacity-90'
                                asChild
                            >
                                <Link to={ROUTES.LOGIN}>
                                    <Lightning
                                        className='h-4 w-4'
                                        weight='fill'
                                    />
                                    {t('nav.deployOpenClaw')}
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export { Header }
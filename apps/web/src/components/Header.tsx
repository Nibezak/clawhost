import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/Logo'
import { ROUTES } from '@/lib/routes'
import { HardDrive, Key, User, SignOut, Lightning } from '@phosphor-icons/react'

interface HeaderProps {
  showNavLinks?: boolean
  navLinks?: { label: string; href: string; id: string }[]
  activeSection?: string
}

export function Header({ showNavLinks = false, navLinks = [], activeSection = '' }: HeaderProps) {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const displayName = profile?.name || user?.email || ''
  const isProfileReady = !profileLoading || !!profile

  const getInitials = (text: string) => {
    if (!text) return '?'
    const parts = text.split(' ')
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }
    return text.charAt(0).toUpperCase()
  }

  const isLandingPage = location.pathname === '/'

  return (
    <header className={`${isLandingPage ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <Logo />

        {showNavLinks && navLinks.length > 0 ? (
          <nav className="hidden md:flex items-center justify-center gap-6">
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

        <div className="flex items-center gap-3">
          {authLoading || (user && !isProfileReady) ? (
            <div className="flex items-center gap-2 px-1.5 h-7 min-w-[100px]">
              <Skeleton className="w-7 h-7 rounded-full bg-white/10 shrink-0" />
              <Skeleton className="w-16 h-4 rounded bg-white/10 hidden sm:block" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-1.5 py-1.5 hover:bg-white/10 min-w-[100px] justify-start">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-[#ef5350] to-[#c62828] text-white text-xs">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300 hidden sm:block max-w-[120px] truncate">
                    {displayName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#151518] border-white/10">
                <DropdownMenuItem
                  onClick={() => navigate(ROUTES.CLAWS)}
                  className={`text-gray-300 focus:text-white focus:bg-white/10 ${location.pathname === ROUTES.CLAWS ? 'bg-white/10' : ''}`}
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Claws
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(ROUTES.SSH_KEYS)}
                  className={`text-gray-300 focus:text-white focus:bg-white/10 ${location.pathname === ROUTES.SSH_KEYS ? 'bg-white/10' : ''}`}
                >
                  <Key className="w-4 h-4 mr-2" />
                  SSH Keys
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(ROUTES.ACCOUNT)}
                  className={`text-gray-300 focus:text-white focus:bg-white/10 ${location.pathname === ROUTES.ACCOUNT ? 'bg-white/10' : ''}`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-red-400 focus:text-red-400 focus:bg-white/10"
                >
                  <SignOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5 hidden sm:block"
              >
                Login
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-[#ef5350] to-[#c62828] hover:opacity-90 text-white border-0 px-4 gap-2" asChild>
                <Link to={ROUTES.LOGIN}>
                  <Lightning className="w-4 h-4" weight="fill" />
                  Deploy OpenClaw
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

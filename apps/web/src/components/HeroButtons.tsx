import type { FC, ReactNode } from 'react'
import type { HeroButtonsProps } from '@/ts/Interfaces'

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { ROUTES } from '@/lib'
import { useGitHubStars, GITHUB_REPO_URL } from '@/hooks'
import { LightningIcon, GithubLogoIcon } from '@phosphor-icons/react'

const HeroButtons: FC<HeroButtonsProps> = ({
    deployLabel,
    githubLabel,
    showStars,
    large
}): ReactNode => {
    const { user } = useAuth()
    const { data: gitHubStars } = useGitHubStars()

    return (
        <>
            <Button
                size='lg'
                className={`gap-2 border-0 bg-gradient-to-r from-[#ef5350] to-[#c62828] font-semibold text-white hover:opacity-90 ${large ? 'px-8 py-6 text-lg' : 'px-6'}`}
                asChild
            >
                <Link
                    to={
                        user
                            ? `${ROUTES.CLAWS}?deploy=true`
                            : `${ROUTES.LOGIN}?deploy=true`
                    }
                >
                    <LightningIcon className='h-5 w-5' weight='fill' />
                    {deployLabel}
                </Link>
            </Button>
            <Button
                size='lg'
                variant='outline'
                className={`border-border bg-foreground/5 text-foreground hover:bg-foreground/10 gap-2 ${large ? 'px-8 py-6 text-lg' : 'px-6'}`}
                asChild
            >
                <a
                    href={GITHUB_REPO_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <GithubLogoIcon className='h-5 w-5' weight='fill' />
                    {githubLabel}

                    {showStars && gitHubStars && (
                        <span className='bg-foreground/10 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs'>
                            {gitHubStars.formatted}
                            <span className='text-[12px]'>★</span>
                        </span>
                    )}
                </a>
            </Button>
        </>
    )
}

export default HeroButtons
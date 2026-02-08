import type { FC, ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ClawSkeleton: FC = (): ReactNode => {
    return (
        <Card>
            <CardContent className='py-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Skeleton className='h-12 w-12 rounded-xl' />
                        <div className='space-y-2'>
                            <Skeleton className='h-5 w-32' />
                            <Skeleton className='h-4 w-48' />
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Skeleton className='h-8 w-24' />
                        <Skeleton className='h-8 w-8' />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export { ClawSkeleton }
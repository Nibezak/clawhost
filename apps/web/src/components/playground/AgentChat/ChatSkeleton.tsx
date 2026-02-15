import type { FC, ReactNode } from 'react'

const ChatSkeleton: FC = (): ReactNode => {
    return (
        <div className='flex h-full flex-col gap-3 p-4'>
            <div className='flex justify-end'>
                <div className='h-10 w-48 animate-pulse rounded-2xl rounded-br-md bg-white/5' />
            </div>
            <div className='flex justify-start'>
                <div className='h-16 w-64 animate-pulse rounded-2xl rounded-bl-md bg-white/[0.03]' />
            </div>
            <div className='flex justify-end'>
                <div className='h-10 w-36 animate-pulse rounded-2xl rounded-br-md bg-white/5' />
            </div>
            <div className='flex justify-start'>
                <div className='h-24 w-72 animate-pulse rounded-2xl rounded-bl-md bg-white/[0.03]' />
            </div>
            <div className='flex justify-end'>
                <div className='h-10 w-52 animate-pulse rounded-2xl rounded-br-md bg-white/5' />
            </div>
        </div>
    )
}

export default ChatSkeleton
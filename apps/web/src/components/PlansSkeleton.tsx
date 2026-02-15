import type { FC, ReactNode } from 'react'

import { t } from '@openclaw/i18n'

const PlansSkeleton: FC = (): ReactNode => {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
                <thead>
                    <tr className='border-b border-white/10'>
                        <th className='font-clash px-4 py-4 text-left font-semibold text-white'>
                            {t('landing.planColumn')}
                        </th>
                        <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                            {t('landing.vCpuColumn')}
                        </th>
                        <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                            {t('landing.ramColumn')}
                        </th>
                        <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                            {t('landing.storageColumn')}
                        </th>
                        <th className='font-clash px-4 py-4 text-center font-semibold text-white'>
                            {t('landing.monthlyColumn')}
                        </th>
                        <th className='px-4 py-4 text-right'></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className='border-b border-white/5'>
                            <td className='px-4 py-4'>
                                <div className='h-5 w-24 animate-pulse rounded bg-white/10' />
                            </td>
                            <td className='px-4 py-4'>
                                <div className='mx-auto h-5 w-8 animate-pulse rounded bg-white/10' />
                            </td>
                            <td className='px-4 py-4'>
                                <div className='mx-auto h-5 w-14 animate-pulse rounded bg-white/10' />
                            </td>
                            <td className='px-4 py-4'>
                                <div className='mx-auto h-5 w-14 animate-pulse rounded bg-white/10' />
                            </td>
                            <td className='px-4 py-4'>
                                <div className='mx-auto h-5 w-16 animate-pulse rounded bg-white/10' />
                            </td>
                            <td className='px-4 py-4 text-right'>
                                <div className='ml-auto h-8 w-20 animate-pulse rounded bg-white/10' />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PlansSkeleton
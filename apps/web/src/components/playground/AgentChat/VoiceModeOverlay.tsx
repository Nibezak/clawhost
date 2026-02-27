import type { FC, ReactNode } from 'react'
import type { VoiceModeOverlayProps } from '@/ts/Interfaces'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, WaveformIcon } from '@phosphor-icons/react'
import { t } from '@openclaw/i18n'
import VoiceOrb from '@/components/playground/AgentChat/VoiceOrb'

const gridStyle = {
    backgroundImage: [
        'linear-gradient(rgba(239,83,80,0.06) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(239,83,80,0.06) 1px, transparent 1px)'
    ].join(', '),
    backgroundSize: '20px 20px',
    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
}

const VoiceModeOverlay: FC<VoiceModeOverlayProps> = ({ onClose }): ReactNode => {
    const [isActive, setIsActive] = useState(false)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='absolute inset-0 z-20 flex flex-col items-center justify-between overflow-hidden bg-[#0a0a0f]/90 backdrop-blur-sm'
            >
                <div
                    className='pointer-events-none absolute inset-0'
                    style={{
                        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239,83,80,0.12), transparent)'
                    }}
                />
                <div
                    className='pointer-events-none absolute inset-0'
                    style={gridStyle}
                />

                <div className='z-10 flex items-center gap-2 pt-6'>
                    <WaveformIcon className='h-4 w-4 text-[#ef5350]' weight='fill' />
                    <span className='text-sm font-semibold text-white'>
                        {t('playground.chatVoiceMode')}
                    </span>
                </div>

                <button
                    onClick={() => setIsActive(!isActive)}
                    className='z-10 cursor-pointer transition-transform hover:scale-105'
                >
                    <VoiceOrb isActive={isActive} size={120} />
                </button>

                <div className='z-10 flex flex-col items-center gap-6 pb-8'>
                    <p className='text-sm text-zinc-400'>
                        {isActive
                            ? t('playground.chatVoiceModeListening')
                            : t('playground.chatVoiceModeTapToSpeak')}
                    </p>
                    <button
                        onClick={onClose}
                        title={t('playground.chatVoiceModeClose')}
                        className='flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20'
                    >
                        <XIcon className='h-5 w-5' weight='bold' />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default VoiceModeOverlay
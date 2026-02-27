import type { FC, ReactNode } from 'react'
import type { VoiceOrbProps } from '@/ts/Interfaces'

import { motion } from 'framer-motion'

const VoiceOrb: FC<VoiceOrbProps> = ({ isActive, size = 140 }): ReactNode => {
    return (
        <div
            className='relative flex items-center justify-center'
            style={{ width: size * 2.5, height: size * 2.5 }}
        >
            <motion.div
                className='absolute rounded-full'
                style={{
                    width: size * 2,
                    height: size * 2,
                    background: 'radial-gradient(circle, rgba(239,83,80,0.15) 0%, transparent 70%)',
                    filter: 'blur(30px)'
                }}
                animate={
                    isActive
                        ? { scale: [1, 1.5, 1.1], opacity: [0.6, 1, 0.6] }
                        : { scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }
                }
                transition={{
                    duration: isActive ? 0.8 : 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            <motion.div
                className='absolute rounded-full'
                style={{
                    width: size * 1.6,
                    height: size * 1.6,
                    background: 'radial-gradient(circle, rgba(239,83,80,0.2) 0%, transparent 65%)',
                    filter: 'blur(20px)'
                }}
                animate={
                    isActive
                        ? { scale: [1, 1.35, 1.05], opacity: [0.5, 1, 0.5] }
                        : { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }
                }
                transition={{
                    duration: isActive ? 0.7 : 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: isActive ? 0.1 : 0
                }}
            />

            <motion.div
                className='absolute rounded-full'
                style={{
                    width: size * 1.2,
                    height: size * 1.2,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    filter: 'blur(12px)'
                }}
                animate={
                    isActive
                        ? { scale: [1, 1.25, 0.95, 1.15, 1], opacity: [0.6, 1, 0.5, 0.9, 0.6] }
                        : { scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }
                }
                transition={{
                    duration: isActive ? 1 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: isActive ? 0.2 : 0
                }}
            />

            <motion.div
                className='rounded-full'
                style={{
                    width: size,
                    height: size,
                    background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(220,220,225,0.9) 50%, rgba(180,180,190,0.85) 100%)',
                    boxShadow: '0 0 60px rgba(239,83,80,0.3), 0 0 120px rgba(239,83,80,0.15), inset 0 -8px 20px rgba(0,0,0,0.1)'
                }}
                animate={
                    isActive
                        ? {
                            scale: [1, 1.12, 0.96, 1.08, 1],
                            boxShadow: [
                                '0 0 60px rgba(239,83,80,0.3), 0 0 120px rgba(239,83,80,0.15), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 80px rgba(239,83,80,0.5), 0 0 160px rgba(239,83,80,0.25), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 50px rgba(239,83,80,0.25), 0 0 100px rgba(239,83,80,0.12), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 70px rgba(239,83,80,0.4), 0 0 140px rgba(239,83,80,0.2), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 60px rgba(239,83,80,0.3), 0 0 120px rgba(239,83,80,0.15), inset 0 -8px 20px rgba(0,0,0,0.1)'
                            ]
                        }
                        : {
                            scale: [1, 1.03, 1],
                            boxShadow: [
                                '0 0 60px rgba(239,83,80,0.3), 0 0 120px rgba(239,83,80,0.15), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 80px rgba(239,83,80,0.4), 0 0 140px rgba(239,83,80,0.2), inset 0 -8px 20px rgba(0,0,0,0.1)',
                                '0 0 60px rgba(239,83,80,0.3), 0 0 120px rgba(239,83,80,0.15), inset 0 -8px 20px rgba(0,0,0,0.1)'
                            ]
                        }
                }
                transition={{
                    duration: isActive ? 1 : 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </div>
    )
}

export default VoiceOrb
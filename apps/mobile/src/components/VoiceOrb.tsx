import type { FC, ReactNode } from 'react'
import type { VoiceOrbProps } from '@/ts/Interfaces'

import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { COLORS } from '@/lib/theme'

const VoiceOrb: FC<VoiceOrbProps> = ({ isActive, size = 160 }): ReactNode => {
    const pulseScale1 = useRef(new Animated.Value(1)).current
    const pulseScale2 = useRef(new Animated.Value(1)).current
    const pulseOpacity1 = useRef(new Animated.Value(0.06)).current
    const pulseOpacity2 = useRef(new Animated.Value(0.03)).current
    const coreScale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        if (isActive) {
            const activeAnimation = Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(coreScale, {
                            toValue: 1.12,
                            duration: 300,
                            useNativeDriver: true
                        }),
                        Animated.timing(coreScale, {
                            toValue: 0.96,
                            duration: 250,
                            useNativeDriver: true
                        }),
                        Animated.timing(coreScale, {
                            toValue: 1.08,
                            duration: 200,
                            useNativeDriver: true
                        }),
                        Animated.timing(coreScale, {
                            toValue: 1,
                            duration: 250,
                            useNativeDriver: true
                        })
                    ]),
                    Animated.sequence([
                        Animated.timing(pulseScale1, {
                            toValue: 1.3,
                            duration: 500,
                            useNativeDriver: true
                        }),
                        Animated.timing(pulseScale1, {
                            toValue: 1.05,
                            duration: 500,
                            useNativeDriver: true
                        })
                    ]),
                    Animated.sequence([
                        Animated.timing(pulseOpacity1, {
                            toValue: 0.12,
                            duration: 500,
                            useNativeDriver: true
                        }),
                        Animated.timing(pulseOpacity1, {
                            toValue: 0.04,
                            duration: 500,
                            useNativeDriver: true
                        })
                    ]),
                    Animated.sequence([
                        Animated.delay(150),
                        Animated.timing(pulseScale2, {
                            toValue: 1.5,
                            duration: 500,
                            useNativeDriver: true
                        }),
                        Animated.timing(pulseScale2, {
                            toValue: 1.1,
                            duration: 350,
                            useNativeDriver: true
                        })
                    ]),
                    Animated.sequence([
                        Animated.delay(150),
                        Animated.timing(pulseOpacity2, {
                            toValue: 0.08,
                            duration: 500,
                            useNativeDriver: true
                        }),
                        Animated.timing(pulseOpacity2, {
                            toValue: 0.02,
                            duration: 350,
                            useNativeDriver: true
                        })
                    ])
                ])
            )
            activeAnimation.start()
            return () => activeAnimation.stop()
        }

        const idleAnimation = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(coreScale, {
                        toValue: 1.03,
                        duration: 2500,
                        useNativeDriver: true
                    }),
                    Animated.timing(coreScale, {
                        toValue: 1,
                        duration: 2500,
                        useNativeDriver: true
                    })
                ]),
                Animated.sequence([
                    Animated.timing(pulseScale1, {
                        toValue: 1.12,
                        duration: 3000,
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseScale1, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true
                    })
                ]),
                Animated.sequence([
                    Animated.timing(pulseOpacity1, {
                        toValue: 0.09,
                        duration: 3000,
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseOpacity1, {
                        toValue: 0.04,
                        duration: 3000,
                        useNativeDriver: true
                    })
                ]),
                Animated.sequence([
                    Animated.timing(pulseScale2, {
                        toValue: 1.2,
                        duration: 3500,
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseScale2, {
                        toValue: 1,
                        duration: 3500,
                        useNativeDriver: true
                    })
                ]),
                Animated.sequence([
                    Animated.timing(pulseOpacity2, {
                        toValue: 0.05,
                        duration: 3500,
                        useNativeDriver: true
                    }),
                    Animated.timing(pulseOpacity2, {
                        toValue: 0.02,
                        duration: 3500,
                        useNativeDriver: true
                    })
                ])
            ])
        )
        idleAnimation.start()
        return () => idleAnimation.stop()
    }, [isActive, coreScale, pulseScale1, pulseScale2, pulseOpacity1, pulseOpacity2])

    const glowSize = size * 2

    return (
        <View style={[styles.container, { width: glowSize, height: glowSize }]}>
            <Animated.View
                style={[
                    styles.glow,
                    {
                        width: glowSize,
                        height: glowSize,
                        borderRadius: glowSize / 2,
                        transform: [{ scale: pulseScale2 }],
                        opacity: pulseOpacity2
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.glow,
                    {
                        width: size * 1.5,
                        height: size * 1.5,
                        borderRadius: size * 0.75,
                        transform: [{ scale: pulseScale1 }],
                        opacity: pulseOpacity1
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.core,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        transform: [{ scale: coreScale }]
                    }
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    glow: {
        position: 'absolute',
        backgroundColor: COLORS.accent
    },
    core: {
        backgroundColor: COLORS.white,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 20
    }
})

export default VoiceOrb
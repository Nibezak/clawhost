import type { FC, ReactNode } from 'react'
import type { RootTabParamList } from '@/ts/Types'

import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { User } from 'phosphor-react-native'
import { BlurView } from 'expo-blur'
import { t } from '@openclaw/i18n'
import COLORS from '@/lib/theme/colors'
import ClawMascotOutline from '@/components/ClawMascotOutline'
import ClawsScreen from '@/screens/ClawsScreen'
import AccountScreen from '@/screens/AccountScreen'

const Tab = createBottomTabNavigator<RootTabParamList>()

const TabNavigator: FC = (): ReactNode => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopColor: 'rgba(255,255,255,0.08)',
                    borderTopWidth: 1,
                    elevation: 0
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={60}
                        tint='dark'
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarActiveTintColor: COLORS.tabBarActive,
                tabBarInactiveTintColor: COLORS.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Satoshi-Medium'
                }
            }}
        >
            <Tab.Screen
                name='Claws'
                options={{
                    tabBarLabel: t('nav.claws'),
                    tabBarIcon: ({ color, size }) => <ClawMascotOutline size={size} color={color} />
                }}
            >
                {() => <ClawsScreen />}
            </Tab.Screen>
            <Tab.Screen
                name='Account'
                options={{
                    tabBarLabel: t('nav.account'),
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} weight='bold' />
                }}
            >
                {() => <AccountScreen />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default TabNavigator
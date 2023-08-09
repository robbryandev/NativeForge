import { NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'
import nativeforgeConfig from 'app/nativeforge.config.mjs'

const defaultScreen: string = Object.keys(nativeforgeConfig.pages)[0]!

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationContainer
      // @ts-expect-error dynamic pages to screens mapping incompatible with type inference 
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: defaultScreen,
            screens: nativeforgeConfig.pages
          },
        }),
        []
      )}
    >
      {children}
    </NavigationContainer>
  )
}

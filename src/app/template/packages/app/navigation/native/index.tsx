import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from '../../features/home/screen'

const Stack = createNativeStackNavigator<{
  home: undefined
}>()

export function NativeNavigation() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen
        name="home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  )
}

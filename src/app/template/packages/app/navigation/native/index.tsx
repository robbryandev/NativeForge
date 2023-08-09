import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from 'app/features/Home/screen'

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
        options={{
          title: 'Home',
        }}
      />
    </Stack.Navigator>
  )
}

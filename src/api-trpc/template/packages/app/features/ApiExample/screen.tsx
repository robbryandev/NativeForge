import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { trpc } from 'app/features/api/trpc/client'

export function ApiExampleScreen() {
  const greeting = trpc.greeting.useQuery({ name: "NativeForge TRPC Api" }).data?.text;
  return (
    <View>
      <Text className="text-2xl font-semibold">{greeting}</Text>
    </View>
  )
}

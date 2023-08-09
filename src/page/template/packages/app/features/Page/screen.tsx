import { View} from "app/design/view"
import { Text, TextLink } from "app/design/typography"

export default function $pageScreen() {
    return (
        <View>
            <Text>$pageScreen</Text>
            <TextLink href={"/"}>Back</TextLink>
        </View>
    )
}
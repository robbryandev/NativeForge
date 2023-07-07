import {Platform} from 'react-native'
import { nextPort, appUrl } from 'app/nativeforge.config';

export default function getApi() {
    // Android studio emulators use a dedicated loopback address
    // instead of standard localhost
    let result: string = Platform.OS === "ios"
        ? `http://localhost:${nextPort}/api`
        : `http://10.0.2.2:${nextPort}/api`;
    if (process.env.NODE_ENV === "production") {
        result = `${appUrl}/api`!
    }
    return result
}
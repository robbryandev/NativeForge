import {Platform} from 'react-native'
import nativeforge from 'app/nativeforge.config.mjs';

export default function getApi() {
    // Android studio emulators use a dedicated loopback address
    // instead of standard localhost
    let result: string = Platform.OS === "ios"
        ? `http://localhost:${nativeforge.nextPort}/api`
        : `http://10.0.2.2:${nativeforge.nextPort}/api`;
    if (process.env.NODE_ENV === "production") {
        result = `${nativeforge.appUrl}/api`!
    }
    return result
}
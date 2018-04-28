import { PushOptions } from "@ionic-native/push";

export const pushOptions: PushOptions = {
    android: {
        senderID: '636066330815',
        icon: 'icon'
    },
    ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
    },
    windows: {}
}
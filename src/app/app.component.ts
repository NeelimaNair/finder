import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications'
import { LoginPage } from '../pages/login/login';
import { PnProvider } from '../providers/pn/pn';

// import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    pn: PnProvider, localNotification:LocalNotifications) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      pn.pushObj.on('notification').subscribe(notification => {
        if (notification.additionalData.foreground) {
          localNotification.requestPermission().then(permission => {
            if(permission === true){
              localNotification.schedule({
                title: notification.title,
                text: notification.message
              });
            }
          });
        }
        console.log(notification);
      });

      pn.pushObj.on('error').subscribe((e) => {
        console.log(e);
      });

      pn.pushObj.on('registration').subscribe(token => {
        console.log(token);
        pn.registerToken(token.registrationId);
      })
    });
  }
}


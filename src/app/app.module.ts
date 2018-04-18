import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewPlacePage } from '../pages/new-place/new-place';
import { EditPlacePage } from '../pages/edit-place/edit-place';

import { AngularFireModule } from 'angularfire2'; 
import { FIREBASE_CONFIG } from './firebase.credentials'; 
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RestaurantServiceProvider } from '../providers/restaurant-service/restaurant-service'; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewPlacePage,
    EditPlacePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewPlacePage,
    EditPlacePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestaurantServiceProvider
  ]
})
export class AppModule {}

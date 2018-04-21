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
import { LoginPage } from '../pages/login/login';

import { AngularFireModule } from 'angularfire2'; 
import { FIREBASE_CONFIG } from './firebase.credentials'; 
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';
import { RestaurantServiceProvider } from '../providers/restaurant-service/restaurant-service'; 
import { RoomsPage } from '../pages/rooms/rooms';
import { MessagesPage } from '../pages/messages/messages';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewPlacePage,
    EditPlacePage,
    LoginPage,
    RoomsPage,
    MessagesPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewPlacePage,
    EditPlacePage,
    LoginPage,
    RoomsPage,
    MessagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestaurantServiceProvider,
    Geolocation,
    ChatServiceProvider
  ]
})
export class AppModule {}

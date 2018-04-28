import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 

import { Restaurant } from '../../model/restaurant';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { MessagesPage } from '../messages/messages';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
// import { AgmMap, AgmMarker } from '@agm/core';

/**
 * Generated class for the ViewPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-place',
  templateUrl: 'view-place.html',
})
export class ViewPlacePage {

  restaurant: Restaurant = {
    userUid: '',
    restaurantName:'',
    address:'',
    longitude:0,
    latitude:0,
    cuisine:'',
    phone:'',
    unit:''
  }
  // location: { lat: number, lng: number } = { lat: 1.3243817999999998, lng: 103.86480030000001 };
  lat : number;
  lng : number;
  // lat: number = 51.678418;
  // lng: number = 7.809007;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    public singletonUser: SingletonUserServiceProvider, public csp: ChatServiceProvider
  ) {
      this.restaurant = this.navParams.get('rest');
      console.log(this.restaurant)
      // this.lat = +this.restaurant.latitude;
      // this.lng = +this.restaurant.longitude;
  }

  ionViewDidLoad() {
    // this.restaurant = this.navParams.get('rest');
    // console.log('Resturant',this.restaurant);
    
  }

  beginChat(){
    console.log('begin chat');
    
    let user = {
      userUid: this.singletonUser.getUserUid(),
      name: this.singletonUser.getUserName()
    }
    let promise = new Promise(res => {
      this.csp.createOrGetRoom(user, this.restaurant)
        .subscribe(room => {
          console.log('Room retrieved', room);
          res(room);
        });
    });
    promise.then(room => {
      this.navCtrl.push(MessagesPage, {
        room: room,
        user: user
      });
    });
  }
}

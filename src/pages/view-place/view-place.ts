import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 

import { Restaurant } from '../../model/restaurant';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { MessagesPage } from '../messages/messages';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

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
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    public singletonUser: SingletonUserServiceProvider, public csp: ChatServiceProvider
  ) {
      this.restaurant = this.navParams.get('rest');
  }

  createMarker(lat,lng){
    let marker = new google.maps.Marker({
      position: { lat, lng },
      animation: google.maps.Animation.DROP,
      map: this.map,
      title: 'Resturant'
    });
  }

  ionViewDidLoad() {
    if(this.restaurant){
      const pyrmont = new google.maps.LatLng(this.restaurant.latitude,this.restaurant.longitude);
      this.map = new google.maps.Map(document.getElementById('view-place-map'), { center: pyrmont, zoom: 16 });
      this.createMarker(this.restaurant.latitude,this.restaurant.longitude);
    }
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

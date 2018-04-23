import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 

import { Restaurant } from '../../model/restaurant';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';


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
    longitude:'',
    latitude:'',
    cuisine:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    public singletonUser: SingletonUserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPlacePage');
    this.restaurant = this.navParams.get('rest');
    console.log('Names::'+this.restaurant.restaurantName);
  }


}

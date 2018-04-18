import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable'; 

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-edit-place',
  templateUrl: 'edit-place.html',
})
export class EditPlacePage {

  restaurant: Restaurant = {
    userUid: '',
    restaurantName:'',
    address:'',
    longitude:'',
    latitude:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    private restaurantService: RestaurantServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPlacePage');
    this.restaurant = this.navParams.get('restaurant');
    console.log('Names::'+this.restaurant.restaurantName);
  }

  updateRestaurant(restaurant: Restaurant){
    restaurant.userUid = 'Ands1278323';
      this.restaurantService.updateRestaurant(restaurant).then(
        ref => {
          this.navCtrl.setRoot(HomePage);
        })
  }

  removeRestaurant(restaurant: Restaurant){
    restaurant.userUid = 'Ands1278323';
      this.restaurantService.removeRestaurant(restaurant).then(
        ref => {
          this.navCtrl.setRoot(HomePage);
        })
  } 

}

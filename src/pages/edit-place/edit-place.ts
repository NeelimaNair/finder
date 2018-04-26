import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable'; 

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { HomePage } from '../home/home';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';



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
    longitude:0,
    latitude:0,
    cuisine:'',
    phone:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    private restaurantService: RestaurantServiceProvider, public singletonUser: SingletonUserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPlacePage');
    this.restaurant = this.navParams.get('restaurant');
    console.log('Names::'+this.restaurant.restaurantName);
  }

  updateRestaurant(restaurant: Restaurant){
        this.restaurantService.updateRestaurant(restaurant).then(
        ref => {
          this.navCtrl.setRoot(HomePage);
        })
  }

  removeRestaurant(restaurant: Restaurant){
    
      this.restaurantService.removeRestaurant(restaurant).then(
        ref => {
          this.navCtrl.setRoot(HomePage);
        })
  } 
  
}

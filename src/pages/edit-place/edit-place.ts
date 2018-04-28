import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable'; 

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { HomePage } from '../home/home';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { AutocompletePage } from '../autocomplete/autocomplete';


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
    phone:'',
    unit:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public db : AngularFireDatabase,
    private restaurantService: RestaurantServiceProvider, public singletonUser: SingletonUserServiceProvider,
    private modalCtrl:ModalController) {
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.restaurant.address = data;
      alert('address;'+this.restaurant.address);
      this.geoCode(this.restaurant.address);
    });
    modal.present();
  }

  //convert Address string to lat and long
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.restaurant.latitude = results[0].geometry.location.lat();
    this.restaurant.longitude = results[0].geometry.location.lng();    
   });
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

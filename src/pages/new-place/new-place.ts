import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable'; 

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { HomePage } from '../home/home';
import { AutocompletePage } from '../autocomplete/autocomplete';

@IonicPage()
@Component({
  selector: 'page-new-place',
  templateUrl: 'new-place.html',
})
export class NewPlacePage {

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
  private restaurantService: RestaurantServiceProvider, 
  private singletonUser : SingletonUserServiceProvider,
  public modalCtrl:ModalController) {
         
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPlacePage');
  }

  addRestaurant(restaurant: Restaurant){
    restaurant.userUid = this.singletonUser.getUserUid();
    this.restaurantService.addRestaurant(restaurant).then(
      ref => {
          this.navCtrl.setRoot(HomePage);
    });
  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.restaurant.address = data;      
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
    //alert("Got the LAT: " + this.restaurant.latitude + ", long: " + this.restaurant.longitude);
   });
 }

  /*
  ngAfterViewInit() {
    var input = document.getElementById('autocomplete').getElementsByTagName('input')[0];
    var options = {componentRestrictions: {country: 'sg'}};
    new google.maps.places.Autocomplete(input, options);
}*/

}

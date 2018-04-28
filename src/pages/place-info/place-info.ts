import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NearbyRestaurant } from '../../model/nearbyRestaurant';

@IonicPage()
@Component({
  selector: 'page-place-info',
  templateUrl: 'place-info.html',
})
export class PlaceInfoPage {
  restaurant : any;
  map: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.navParams)
    this.restaurant = this.navParams.get('rest');
      // console.log(this.restaurant)
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
      const pyrmont = new google.maps.LatLng(this.restaurant.lat,this.restaurant.lng);
      this.map = new google.maps.Map(document.getElementById('place-map'), { center: pyrmont, zoom: 12 });
      this.createMarker(this.restaurant.lat,this.restaurant.lng);
    }
  }

}

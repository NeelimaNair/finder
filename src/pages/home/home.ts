import { Component, ViewChild ,ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewPlacePage } from '../new-place/new-place';
import { EditPlacePage } from '../edit-place/edit-place';
import { Observable } from 'rxjs/Observable'; 
import firebase from 'firebase';
import { Geolocation, GeolocationOptions ,Geoposition ,PositionError  } from '@ionic-native/geolocation';
import {} from '@types/googlemaps';

import { Restaurant } from '../../model/restaurant';
import { NearbyRestaurant } from '../../model/nearbyRestaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { RoomsPage } from '../rooms/rooms';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { MessagesPage } from '../messages/messages';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { NearbyResturantService } from '../../providers/restaurant-service/nearbyresturant-service';
// import _ from 'lodash';
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  restaurants: Observable<Restaurant[]>;
  userUid: string;
  userName: string;
  restaurant:   Restaurant;
  location: { lat: number, lng: number } = { lat: 1.292304, lng: 103.7765534 };
  // nearbyResturants: Array<NearbyRestaurant>;
  nearbyRestaurants: NearbyRestaurant[] = [];
  map: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private restaurantService: RestaurantServiceProvider, 
    private geolocation: Geolocation, 
    private csp: ChatServiceProvider,
    private singletonUser: SingletonUserServiceProvider,
    private nearbyRestaurantService: NearbyResturantService,
  ) {
      this.userUid = this.singletonUser.getUserUid();
      this.userName = this.singletonUser.getUserName();
      this.restaurants = this.restaurantService.getRestaurantList()
      .snapshotChanges()
      .map(       
        changes => {         
          return changes.map( c=> ({           
            key: c.payload.key, ...c.payload.val()         
          }))       
      });       
  }

  onLoadNewPlace(){    
      console.log('Going into if'+this.userUid);
     
      if(this.restaurant != null){
        console.log('In if');        
        this.navCtrl.push(EditPlacePage,{restaurant : this.restaurant});
      } else{
        console.log('In Else');
        this.navCtrl.push(NewPlacePage);
      }
    
  }

  viewChatRooms() {
    this.navCtrl.push(RoomsPage, {
      user: {
        userUid: this.userUid,
        name: this.userName
      },
    });
  }

  createMarker(lat,lng){
    let marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: 'Hello World!'
    });
  }

  ionViewDidLoad(){
    console.log('Ion View Did Load');
    let self = this;
   
    //Current Location
    this.geolocation.getCurrentPosition().then((location) => {
      console.log(location)
      this.location.lat = location.coords.latitude;
      this.location.lng = location.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    const pyrmont = new google.maps.LatLng(this.location.lat,this.location.lng);
    this.map = new google.maps.Map(document.getElementById('map'), { center: pyrmont, zoom: 15 });
    this.createMarker(this.location.lat,this.location.lng);
    
    const request = {
      location: pyrmont,
      radius: '500',
      query: 'restaurant'
    };
     let placesService = new google.maps.places.PlacesService(this.map)
     placesService.textSearch(request, (results, status) => {
       if(status === 'OK'){
         results.map(resturant => {
           const restLat = resturant.geometry.location.lat()
           const restLng = resturant.geometry.location.lng()
           resturant.lat = resturant.geometry.location.lat();
           resturant.lng = resturant.geometry.location.lng();
           self.createMarker(restLat,restLng)
           self.nearbyRestaurantService.addPlace(resturant);
         })
       }
     });

    //Loading All Resturants
    const  restRef:firebase.database.Reference  = firebase.database().ref('restaurants/'+this.userUid);
    restRef.on('value', restSnapshot => {
        this.restaurant = restSnapshot.val();
    });
     console.log('Resturants',this.restaurants)
  }


  ionViewDidEnter(){
    this.nearbyRestaurants = this.nearbyRestaurantService.getPlaces();
  }

}

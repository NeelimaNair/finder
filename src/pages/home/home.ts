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
import { RegNearByRestaurant } from '../../model/regNearByRestaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { RoomsPage } from '../rooms/rooms';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { MessagesPage } from '../messages/messages';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { NearbyResturantService } from '../../providers/restaurant-service/nearbyresturant-service';
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
  nearbyRestaurants: NearbyRestaurant[] = [];
  regNearByRestaurants : RegNearByRestaurant[] = [];
  

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
      /* this.restaurants = this.restaurantService.getRestaurantList()
      .snapshotChanges()
      .map(       
        changes => {         
          return changes.map( c=> ({           
            key: c.payload.key, ...c.payload.val()         
          }))       
      });    */    
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

  createMarker(lat,lng, index){
    let marker = new google.maps.Marker({
      position: { lat, lng },
      animation: google.maps.Animation.DROP,
      label: index.toString(),
      map: this.map,
      title: 'Resturant'
    });
  }

  // customMarker(lat,lng){
  //   let marker = new google.maps.Marker({
  //     position: { lat, lng },
  //     animation: google.maps.Animation.DROP,
  //     label: 'R',
  //     map: this.map,
  //     title: 'Resturant'
  //   });
  // }

  ionViewDidLoad(){
    console.log('Ion View Did Load');
    let self = this;
   
    //Current Location
    this.geolocation.getCurrentPosition().then((location) => {
      console.log('current location::'+location.coords.latitude+'::'+location.coords.longitude)
      this.location.lat = location.coords.latitude;
      this.location.lng = location.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

    const pyrmont = new google.maps.LatLng(this.location.lat,this.location.lng);
    this.map = new google.maps.Map(document.getElementById('map'), { center: pyrmont, zoom: 12 });
    this.createMarker(this.location.lat,this.location.lng,21);
    
    const request = {
      location: pyrmont,
      radius: '500',
      query: 'restaurant'
    };
     let placesService = new google.maps.places.PlacesService(this.map)
     placesService.textSearch(request, (results, status) => {
       if(status === 'OK'){
         results.map((resturant,index) => {
           const restLat = resturant.geometry.location.lat()
           const restLng = resturant.geometry.location.lng()
           resturant.lat = restLat;
           resturant.lng = restLng;
           resturant.index = index+1;
           self.createMarker(restLat,restLng,resturant.index)
           self.nearbyRestaurantService.addPlace(resturant);
         })
       }
     });

     //Loading All restaurants
     console.log('Start#################');
     this.restaurants = this.restaurantService.getRestaurantList().valueChanges();
     this.restaurants.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          console.log(snapshot.restaurantName);
          console.log(this.getDistanceFromLatLonInKm(snapshot.latitude,snapshot.longitude,
            this.location.lat,this.location.lng));       
            var tempRegRest : RegNearByRestaurant = {
              distance: this.getDistanceFromLatLonInKm(snapshot.latitude,snapshot.longitude,
                this.location.lat,this.location.lng),
              restaurantName:snapshot.restaurantName,
              address:snapshot.address ,
              displayDistance:  this.getDistanceFromLatLonInKm(snapshot.latitude,snapshot.longitude,
                this.location.lat,this.location.lng).toFixed(3),
                longitude:snapshot.longitude,
                latitude:snapshot.latitude,
                cuisine:snapshot.cuisine,
                phone:snapshot.phone,
                unit:snapshot.unit,
                userUid: snapshot.userUid
            };
            var flag = true;
            this.regNearByRestaurants.forEach(element => {
              if(element.restaurantName == snapshot.restaurantName && 
              element.address == snapshot.address ){
                  flag = false;
              }
            });  
            if(flag && tempRegRest.distance < 5){
              this.regNearByRestaurants.push(tempRegRest);
            }
            
        });
        this.regNearByRestaurants = this.regNearByRestaurants.sort((a,b) =>
         {return a.distance - b.distance;}     
      );
        console.log('Done#################'+this.regNearByRestaurants);        
     });
     


    //Loading Specific Resturants
    const  restRef:firebase.database.Reference  = firebase.database().ref('restaurants/'+this.userUid);
    restRef.on('value', restSnapshot => {
        this.restaurant = restSnapshot.val();
    });
     console.log('Resturants',this.restaurants)
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon =this. deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
   }

   deg2rad(deg) {
    return deg * (Math.PI/180)
   }


  ionViewDidEnter(){
    this.nearbyRestaurants = this.nearbyRestaurantService.getPlaces();
  }

}

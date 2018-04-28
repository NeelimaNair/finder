import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewPlacePage } from '../new-place/new-place';
import { EditPlacePage } from '../edit-place/edit-place';
import { Observable } from 'rxjs/Observable'; 
import firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';
import { RoomsPage } from '../rooms/rooms';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { MessagesPage } from '../messages/messages';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  restaurants: Observable<Restaurant[]>;
  userUid: string;
  userName: string;
  restaurant:   Restaurant;
  location: { lat: number, lng: number } = { lat: 1.3243817999999998, lng: 103.86480030000001 };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private restaurantService: RestaurantServiceProvider, 
    private geolocation: Geolocation, 
    private csp: ChatServiceProvider,
    private singletonUser: SingletonUserServiceProvider
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

  ionViewDidLoad(){
    console.log('Ion View Did Load');
    //Loading All Resturants
    const  restRef:firebase.database.Reference  = firebase.database().ref('restaurants/'+this.userUid);
    restRef.on('value', restSnapshot => {
      console.log('Restaurant set');
        this.restaurant = restSnapshot.val();
    });
    //Current Location
    this.geolocation.getCurrentPosition().then((location) => {
      console.log(location)
      this.location.lat = location.coords.latitude;
      this.location.lng = location.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });



  }

}

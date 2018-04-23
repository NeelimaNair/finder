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

  /**
   * TODO: Test data, to be removed
   */
  user:any = ({
    userUid: 'user1',
    name: 'user a1'
  })
  user2:any =({
    userUid: 'user2',
    name: 'user b2'
  })
  r:Restaurant = ({
    userUid: 'user2',
    restaurantName: 'McD',
    address: 'address re',
    longitude: '1',
    latitude: '2',
    cuisine:''
  }) as Restaurant;
  /*********************************** */

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
      // user: {
      //   userUid: this.userUid,
      //   name: this.userName
      // },
      user: this.user2
    });
  }

  /**
   * TODO: Move to proper location
   */
  beginChat(){
    console.log('begin chat');
    
    let promise = new Promise(res => {
      this.csp.createOrGetRoom(this.user, this.r)
        .subscribe(room => {
          console.log('Room retrieved', room);
          res(room);
        });
    });
    promise.then(room => {
      this.navCtrl.push(MessagesPage, {
        room: room,
        user: this.user
      });
    });
  }

  ionViewDidLoad(){
    
    console.log('Ion View Did Load');
    const  restRef:firebase.database.Reference  = firebase.database().ref('restaurants/'+this.userUid);
    restRef.on('value', restSnapshot => {
      console.log('Restaurant set');
        this.restaurant = restSnapshot.val();
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('resp:'+resp)
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

}

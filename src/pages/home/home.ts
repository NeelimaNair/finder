import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewPlacePage } from '../new-place/new-place';
import { EditPlacePage } from '../edit-place/edit-place';
import { Observable } from 'rxjs/Observable'; 
import firebase from 'firebase';

import { Restaurant } from '../../model/restaurant';
import { RestaurantServiceProvider} from '../../providers/restaurant-service/restaurant-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  restaurants: Observable<Restaurant[]>;
  userUid: string;
  restaurant:   Restaurant;


  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private restaurantService: RestaurantServiceProvider) {
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
    this.userUid = 'Ands1278323';
    
      console.log('Going into if');
     
      if(this.restaurant != null){
        console.log('In if');        
        this.navCtrl.push(EditPlacePage,{restaurant : this.restaurant});
      } else{
        console.log('In Else');
        this.navCtrl.push(NewPlacePage);
      }
    
  }

  ionViewDidLoad(){
    this.userUid = 'Ands1278323';
    console.log('Ion View Did Load');
    const  restRef:firebase.database.Reference  = firebase.database().ref('restaurants/'+this.userUid);
    restRef.on('value', restSnapshot => {
      console.log('Restaurant set');
        this.restaurant = restSnapshot.val();
    });
  }

}

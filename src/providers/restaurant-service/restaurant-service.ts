import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'
import { Restaurant } from '../../model/restaurant';


@Injectable()
export class RestaurantServiceProvider {

  private restaurantListRef = this.db.list<Restaurant>('restaurants');  

  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello RestaurantServiceProvider Provider');
  }

  getRestaurantList(){
    return this.restaurantListRef;
  }

  getRestaurantForUser(userUid: string){
    console.log('RestaurantService:'+'restaurants/'+userUid);
    return this.db.list<Restaurant>('restaurants/'+userUid);
  }

  addRestaurant(restaurant : Restaurant){
    return this.restaurantListRef.set(restaurant.userUid,restaurant);
  }

  updateRestaurant(restaurant : Restaurant){
    return this.restaurantListRef.update(restaurant.userUid,restaurant);
  }

  removeRestaurant(restaurant : Restaurant){
    return this.restaurantListRef.remove(restaurant.userUid);
  }


}

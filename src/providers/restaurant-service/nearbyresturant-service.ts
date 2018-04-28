// import { NearbyResturant } from '../../model/nearbyRestaurant';

export class NearbyResturantService {
    private nearbyResturants: {
        id: string,
        formatted_address: string,
        name: string,
        icon: string,
        place_id: string,
        rating: number,
        lat: number,
        lng: number
    }[] = [];

    addPlace(nearbyResturant: {
        id: string,
        formatted_address: string,
        name: string,
        icon: string,
        place_id: string,
        rating: number,
        lat: number,
        lng: number
    }){
        this.nearbyResturants.push(nearbyResturant);
    }

    getPlaces(){
        return this.nearbyResturants.slice()
    }


}
export interface RegNearByRestaurant {
    distance: number;
    restaurantName?:String;
    address:string;  
    displayDistance:string; 
    longitude:number;
    latitude:number;
    cuisine:string;
    phone:string;
    unit:string; 
    userUid: string;   
}
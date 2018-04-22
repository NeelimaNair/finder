import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SingletonUserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonUserServiceProvider {

  userUid : string;
  userName : string;

  constructor(public http: HttpClient) {
    console.log('Hello SingletonUserServiceProvider Provider');
  }

  getUserUid(){
    return this.userUid;
  }

  setUserUid(userUid : string){
    this.userUid = userUid;
  }

  getUserName(){
    return this.userName;
  }

  setUserName(userName: string){
    this.userName = userName;
  }

}

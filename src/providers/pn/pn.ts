import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushObject, Push } from '@ionic-native/push';
import { pushOptions } from './push-options';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the PnProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PnProvider {
  pushObj: PushObject;
  token: string;

  constructor(public http: HttpClient,
    private push: Push,
    private db: AngularFireDatabase) {
    console.log('Hello PnProvider Provider');
    this.pushObj = push.init(pushOptions);
  }

  registerToken(token: string){
    this.token = token;
  }

  saveToken(userUid:string) {
    var deviceRef = this.db.object('devices/' + userUid);
    deviceRef.set(this.token);
  }

  getToken(userUid: string){
    return this.db.object('devices/' + userUid);
  }
}

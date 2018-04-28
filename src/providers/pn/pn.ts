import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PushObject, Push } from '@ionic-native/push';
import { pushOptions } from './push-options';
import { AngularFireDatabase } from 'angularfire2/database';
import { PN_KEY } from '../../app/firebase.credentials';
import { Observable } from 'rxjs/observable';

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

  registerToken(token: string) {
    this.token = token;
  }

  saveToken(userUid: string) {
    if (this.token !== undefined) {
      var deviceRef = this.db.object('devices/' + userUid);
      console.log(this.token);

      new Observable(ob => {
        deviceRef.snapshotChanges().subscribe(data => {
          if (!data.payload.exists()) {
            ob.next('new');
          }
          else if (data.payload.val() !== this.token) {
            ob.next('refresh');
          }

          ob.complete();
        });
      }).subscribe(data => {
        if (data === 'refresh') {
          console.log('Refresh token');

          deviceRef.update(this.token);
        }
        else if (data === 'new') {
          console.log('New token');

          deviceRef.set(this.token);
        }
      });
    }
  }

  getToken(userUid: string) {
    return this.db.object('devices/' + userUid);
  }

  sendPn(receiverUid: string, senderName:string, message: string) {
    new Observable(ob => {
      this.db.object('devices/' + receiverUid).snapshotChanges()
        .subscribe(data => {
          ob.next(data.payload.val());
          ob.complete();
        });
    })
      .subscribe(token => {
        let body = {
          "notification": {
            "title": "New Notification from " + senderName,
            "body": message,
            "sound": "default",
          },
          "to": token,
          "priority": "normal",
        };

        let options = new HttpHeaders();
        options = options.set('Content-Type', 'application/json');
        options = options.set('Authorization', 'key=' + PN_KEY);
        console.log(options, body);

        this.http.post("https://fcm.googleapis.com/fcm/send",
          body, {
            headers: options,
          }
        ).subscribe();
      });

  }
}

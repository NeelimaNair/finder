import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { room } from '../../models/room';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Observable } from 'rxjs/Observable';
import { MessagesPage } from '../messages/messages';

/**
 * Generated class for the RoomsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rooms',
  templateUrl: 'rooms.html',
})
export class RoomsPage {
  rooms: Observable<room[]>;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private csp: ChatServiceProvider) {
    this.user = this.navParams.get('user');
    this.rooms = this.csp.getRoomList(this.user.userUid).snapshotChanges()
    .map(snapshots => {
      return snapshots.map(snapshot => ({
        key: snapshot.payload.key,
        ...snapshot.payload.val()
      }) as room).sort((a,b) => a.lastUpdatedTime <= b.lastUpdatedTime ? 1 : -1);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomsPage');
  }

  joinChat(chatId:string){
    console.log(this.user.userUid, chatId);
    
    this.csp.markRead(this.user.userUid, chatId);    
    let promise = new Promise(res => {
      this.csp.getRoom(this.user.userUid, chatId).snapshotChanges()
        .subscribe(data => {
          let room = ({
            key: data.payload.key,
            ...data.payload.val()
          }) as room;

          res(room);
        });
    });
    promise.then(room => {
      this.navCtrl.push(MessagesPage, {
        room: room,
        user: this.user,
      });
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UUID } from 'angular2-uuid';

import { room } from '../../models/room';
import { message } from '../../models/message';
import { Restaurant } from '../../model/restaurant';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ChatServiceProvider {

  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello ChatServiceProvider Provider');
  }

  getRoomList(userId: string) {
    return this.db.list<room>('chatrooms/' + userId);
  }

  getMessges(chatId: string) {
    return this.db.list<message>('messages/' + chatId);
  }

  createOrGetRoom(user: any, resturant: Restaurant) {
    let roomRef = this.db.object('chatrooms/' + user.userUid + '/' + resturant.userUid);
    return roomRef.snapshotChanges().map(data => {
      let room: room;
      if (data.payload.exists()) {
        room = ({
          key: data.payload.key,
          ...data.payload.val()
        })
      }
      else {
        const chatId = UUID.UUID();

        room = ({
          name: resturant.restaurantName.toString(),
          receiver: resturant.userUid,
          chatId: chatId,
        });
        roomRef.set(room);
        this.db.object('chatrooms/' + resturant.userUid + '/' + user.userUid).set(({
          name: user.name,
          receiver: user.userUid,
          chatId: chatId,
        }));
      }

      return room;
    });
  }

  getRoom(userId: string, chatId: string) {
    return this.db.object('chatrooms/' + userId + '/' + chatId);
  }

  sendMessage(chatId: string, message: message) {
    let messageRef = this.db.list<message>('messages/' + chatId);
    messageRef.push(message);
  }

  notifyReceiver(sender: string, receiver: string, time: string) {
    let receiverRoom = this.db.object('chatrooms/' + receiver + '/' + sender);
    receiverRoom.update({ lastUpdatedTime: time, isRead: false });
  }

  markRead(userId: string, chatId: string) {
    let roomRef = this.db.object('chatrooms/' + userId + '/' + chatId);
    roomRef.update({ isRead: true });
  }
}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { message } from '../../models/message';
import { room } from '../../models/room';

/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  @ViewChild(Content) content: Content;

  room: room;
  user: any;
  messages: Observable<message[]>;

  data: message;

  constructor(public navCtrl: NavController, public navParams: NavParams, private csp: ChatServiceProvider) {
    this.room = navParams.get('room');
    this.user = navParams.get('user');
    console.log(this.room, this.user);

    this.messages = csp.getMessges(this.room.chatId).snapshotChanges().map(snapshots => {
      console.log(snapshots);

      return snapshots.map<message>(snapshot => {
        return ({
          key: snapshot.payload.key,
          ...snapshot.payload.val()
        })
      });
    });

    this.data = {
      type: 'message',
      sender: this.user.name,
      message: '',
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
    setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 500);
  }

  sendMessage() {
    if (this.data.message !== '') {
      this.data.timestamp = Date();
      this.csp.sendMessage(this.room.chatId, this.data);
      this.csp.notifyReceiver(this.user.userUid, this.room.receiver, this.data.timestamp);

      this.data.message = '';

      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 500);
    }
  }
}

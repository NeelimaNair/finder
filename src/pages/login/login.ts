import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {User} from '../../model/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, private firebaseAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
      const result = await this.firebaseAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result.uid);
      if(result.uid){
        this.navCtrl.push(HomePage);
      }
    }
    catch(error){
      console.log(error);
    }
  }

}

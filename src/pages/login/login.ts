import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import {User} from '../../model/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service'
import { PnProvider } from '../../providers/pn/pn';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController, private firebaseAuth: AngularFireAuth, 
  public singletonUser: SingletonUserServiceProvider, private toast: ToastController,
  private pn: PnProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User){
    try{
      const result = await this.firebaseAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result.email);
      if(result.uid){
        this.singletonUser.setUserUid(result.uid);
        this.singletonUser.setUserName(result.email);

        this.pn.saveToken(result.uid);

        this.navCtrl.push(HomePage);
      }
    }catch(e){
      console.error(e);
      this.toast.create({
        message: e.message,
        duration:4000
      }).present();
    }
  }

  register(){
    this.navCtrl.push('RegisterPage');
  }

}

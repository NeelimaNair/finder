import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../model/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { SingletonUserServiceProvider } from '../../providers/singleton-user-service/singleton-user-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth, 
    public singletonUser: SingletonUserServiceProvider, private toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user : User){
    try{
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
      console.log(result);
      if(result.uid){
        this.singletonUser.setUserUid(result.uid);
        this.singletonUser.setUserName(result.email);
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

}

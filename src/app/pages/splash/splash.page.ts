import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public modalCtrl: ModalController, public splashScreen: SplashScreen) { }

  ionViewDidEnter() {
    this.splashScreen.hide();
    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 3000);
  }


  ngOnInit() {
  }

}

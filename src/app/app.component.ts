import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, ModalController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashPage } from './pages/splash/splash.page';
import { NotificationService } from './services';
import { FCM } from '@ionic-native/fcm/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild('splash', {static: false}) splash: ElementRef;
  splashDone: boolean = false;

  public onlineOffline: boolean = navigator.onLine

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private ntfcService: NotificationService,
    private fcm: FCM,
    private firebaseX: FirebaseX
  ) {
    this.checkConnection();
    this.initializeApp();
  }

  checkConnection(): void {
    if (!navigator.onLine) {
      //Do task when no internet connection
      this.presentToast('You are not online, please connect!');
    }
    window.addEventListener('offline', () => {
      //Do task when no internet connection
      this.presentToast("You are not online, please connect!");
    });

    // window.addEventListener('online', () => {
    //   //Do task when no internet connection
    //   this.presentToast("You are currently online now.");
    // });
  }

  async presentToast(msg: string): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.ntfcService.onNotifications().subscribe(
      (msg) => {
        this.presentToast(msg.body);
        this.ntfcService.onAddNotification(
          {
            title: msg.title,
            content: msg.body,
            checked: false
          }
        );
      });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.firebaseX.subscribe('marketing');

      this.firebaseX.getToken().then(token=>{
        console.log(token);
      })
      
      this.firebaseX.onTokenRefresh().subscribe(token=>{
       console.log(token);
      }) 
      
      this.firebaseX.unsubscribe('marketing');
      
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();

      this.notificationSetup();

      // this.splashScreen.hide();

      setTimeout(() => {
        this.splashDone = true;
        this.splash.nativeElement.style.display = 'none';
      }, 3000);

    });
  }
}

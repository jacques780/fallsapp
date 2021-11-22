import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services';
import { IPresentAlert, IButtonType, Notification } from '../../interface';
import { AlertController } from '@ionic/angular';
import { NotificationService } from '../../services';
import { SharedService, CaptureService } from 'src/app/services';

export interface CardContent {
  icon: string,
  icon_type: string,
  title: string,
  page: string
}
export interface CardOnRow {
  card1: CardContent,
  card2?: CardContent
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notifications: Notification[] = [];
  cardContent1: CardContent = {
    title: 'Build Order',
    page: 'buildOrder',
    icon: 'shopping-bag',
    icon_type: 'fas'
  };
  cardContent2: CardContent = {
    title: 'Order History',
    page: 'orderHistory',
    icon: 'history',
    icon_type: 'fas'
  };
  
  cardContent3: CardContent = {
    title: 'Flyers',
    page: 'flyer',
    icon: 'map',
    icon_type: 'fas'
  };
  
  cardContent4: CardContent = {
    title: 'Photos & Videos',
    page: '../gallery',
    icon: 'photo-video',
    icon_type: 'fas'
  };

  //cardContent5: CardContent = {
  //  title: 'Notifications',
  //  page: 'notification',
  //  icon: 'comment-alt',
  //  icon_type: 'fas'
  //};
  
  cardContent5: CardContent = {
    title: 'Contact Us',
    page: 'contact',
    icon: 'phone',
    icon_type: 'fas'
  };

  cardContent6: CardContent = {
    title: 'Video Call',
    page: 'videoroom',
    icon: 'video',
    icon_type: 'fas'
  };

  cardGridView: CardOnRow[] = [
    { card1: this.cardContent1, card2: this.cardContent2 },
    { card1: this.cardContent3, card2: this.cardContent4 },
    { card1: this.cardContent5, card2: this.cardContent6 }
  ];
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private ntfcService: NotificationService,
    private cdref: ChangeDetectorRef,
    private router: Router,
    public sharedService: SharedService,
    private captureService: CaptureService
  ) { }

  ngOnInit(): void {
    this.initHomePage();
  }

  initHomePage(): void {
    if (this.ntfcService.notifications.length > 0) {
      this.notifications = this.ntfcService.notifications;
    }
    this.ntfcService.notificationSubject.subscribe(() => {
      this.notifications = this.ntfcService.notifications;
      this.cdref.detectChanges();
    });
  }

  gotoPage(page) {
    if (page == 'videoroom') {
      this.captureService.checkVideoCallAvailability().subscribe((response) => {
        console.log(response);
        if (response) {
          if (response.videocalls_status == 1) {
            this.sharedService.presentToast(
              'Video calls should be over WIFI to save on data'
            );
            this.router.navigate([`home/${page}`]);
          } else {
            this.sharedService.presentToast(response.videocalls_disabled_message);
          }
        }
      });
    } else {
      this.router.navigate([`home/${page}`]);
    }
  }

  async onLogOut(): Promise<void> {
    let customAlert: IPresentAlert = {
      header: "Sign out Confirm",
      message: "Are you sure you wish to sign out?",
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' }
      ]
    }
    let alert = await this.presentAlertConfirm(customAlert);
    alert.present();
    alert.onDidDismiss().then((res) => {
      if (res.role == "yes") {
        this.authService.logout();
      }
      else if (res.role == "no") {
        //Nothing to do
      }
      else {
        //if WTH 
        console.log(":)))");
      }
    });
  }

  async presentAlertConfirm(prsAlert: IPresentAlert): Promise<HTMLIonAlertElement> {
    return await this.alertController.create(prsAlert);
  }

  get totalNotification(): number {
    return this.notifications.reduce((sum, ele) => sum += (!ele.checked ? 1 : 0), 0);
  }
}

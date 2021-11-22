import { Injectable } from '@angular/core';
import { ComponentRef } from '@ionic/core';
import {
  NavController, LoadingController, ToastController, AlertController,
  PopoverController, ModalController, Platform
} from '@ionic/angular';
import { IPresentAlert, ITile } from '../interface';
import { ENavigate } from '../enums'

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private popoverController: PopoverController,
    private platform: Platform,
    private modalController: ModalController
  ) { }

  navigate(type: string, page: string): void {
    switch (type) {
      case ENavigate.Forward: {
        this.navCtrl.navigateForward(page);
        break;
      }
      case ENavigate.Back: {
        this.navCtrl.navigateBack(page);
        break;
      }
      default: {
        break;
      }
    }
  }

  async presentAlertConfirm(prsAlert: IPresentAlert): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create(prsAlert);
    await alert.present();
    return alert;
  }

  async presentLoading(): Promise<HTMLIonLoadingElement> {
    return await this.loadingController.create({
      message: 'Please wait...',
    });
  }

  async presentToast(msg: string): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  async presentPVPopover(ev: any, compRef: ComponentRef): Promise<HTMLIonPopoverElement> {
    const popover = await this.popoverController.create({
      component: compRef,
      event: ev,
    });
    await popover.present();
    return popover;
  }

  async presentImageModal(imageId: number, compRef: ComponentRef, tiles: ITile[]): Promise<void> {
    const modal = await this.modalController.create({
      component: compRef,
      cssClass: 'image-modal-view',
      componentProps: {
        position: imageId,
        tiles: tiles
      }
    });
    return await modal.present();
  }

  async getPlatformReady(): Promise<string> {
    return await this.platform.ready();
  }
}

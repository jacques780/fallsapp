import { Component, OnInit } from '@angular/core';
import { IOrderHistory, IPresentAlert, IButtonType, IGetOrderHistoryResult } from '../../../interface';
import { ProductService, AuthService, SharedService } from '../../../services';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: IOrderHistory[] = [];
  constructor(
    private productService: ProductService,
    private authenService: AuthService,
    public sharedService: SharedService) { }

  ngOnInit(): void {
    this.initOrderHistory();
  }

  get email(): string {
    return this.authenService.emailValue;
  }

  async initOrderHistory(): Promise<void> {
    const prsLoading: HTMLIonLoadingElement = await this.sharedService.presentLoading();
    await prsLoading.present();
    try {
      let orderHistoryResultData: IGetOrderHistoryResult =
        await this.productService.getOrderHistory(this.email).toPromise();
      this.orderHistory = JSON.parse(orderHistoryResultData.order_history);
    }
    catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    }
    finally {
      prsLoading.dismiss();
    }
  }

  async onConfirmRemoveCard(event: any, orderId: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    let customAlert: IPresentAlert = {
      header: "Confirm Deletion",
      message: "Delete this card?",
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' }
      ]
    }
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == "yes") {
        this.sharedService.presentToast('Sorry! This feature is not available at the moment :)');
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

  async requestUpdateCart(order) {
    order.isLoading = true;
    this.productService.reorder(order.order_id_real).subscribe((res:any)=>{
      order.isLoading = false;
      if (res.api_result_code==1 && res.result==1) {
        this.sharedService.presentToast('The previously ordered items have been added to your card');
        setTimeout(()=>{
          this.sharedService.navigate('back','home/buildOrder');
        },2000)
      } else {
        this.sharedService.presentToast('There was a problem reordering this cart, contact support');
      }
    }, (error)=>{
      console.log(error);
      this.sharedService.presentToast('There was a problem reordering this cart, contact support');
      order.isLoading = false;
    })
  }

  onCardHoldPressed(event): void {
    if (event.isTrusted) {
      console.log("OK :)) ");

    }
  }
}

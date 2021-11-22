import { NavController } from '@ionic/angular';
import { Component, OnInit, ApplicationRef } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ProductService, AuthService, SharedService } from '../../../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  IPresentAlert,
  IButtonType,
  ISubmit,
  IAddToCart,
  IProductResult,
  IGetCardResult,
  IOrderCard,
  IOrderCardFull,
  IProduct,
  IUserProduct,
} from '../../../interface';
import { ESubmitResult } from '../../../enums';
import { FormControl } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-build-order',
  templateUrl: './build-order.component.html',
  styleUrls: ['./build-order.component.scss'],
})
export class BuildOrderComponent implements OnInit {
  // set barcode scanner to scan last ditgit
  check_digit_on = false;
  loading: boolean = false;
  countSelected: number = 0;
  isShowedNote: boolean = false;
  isShowedSearch: boolean = false;
  isShowedDropdown: boolean = false;
  isOrderSubmitted: boolean = false;
  isCartUpdated: boolean = false;
  isSelectedMode: boolean = false;
  inputText = new FormControl();
  noteCartText = new FormControl();
  productInOderCard: IOrderCardFull[] = [];
  resultProductsList: IProductResult[] = [];
  constructor(
    private barcodeScanner: BarcodeScanner,
    private productService: ProductService,
    private authenService: AuthService,
    public keyboard: Keyboard,
    public sharedService: SharedService,
    public navCtrl: NavController,
    private applicationRef: ApplicationRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initCart(true);
    this.onSearchProduct();
  }

  get email(): string {
    return this.authenService.emailValue;
  }

  async initCart(isRefresh: boolean): Promise<void> {
    const prsLoading: HTMLIonLoadingElement = await this.sharedService.presentLoading();
    this.loading = true;
    await prsLoading.present();
    if (isRefresh) {
      this.productInOderCard = [];
    }
    try {
      let cardResultData: IGetCardResult = await this.productService
        .getUserCard(this.email)
        .toPromise();
      let orderCardData: IOrderCard[] = JSON.parse(cardResultData.cart);
      this.noteCartText.setValue(
        this.productService.noteValue == null
          ? ''
          : this.productService.noteValue
      );
      let productData: IProduct;
      let check: boolean;

      await Promise.all(
        orderCardData.map(async (obj) => {
          productData = await this.productService
            .getProductInfo(obj.mw_code)
            .toPromise();
          check = this.productInOderCard.some(
            (ele) => ele.mw_code === obj.mw_code
          );

          if (!check) {
            this.productInOderCard.push({
              email_address: obj.email_address,
              mw_code: obj.mw_code,
              name: productData.name,
              price: productData.price,
              qty: obj.qty,
              stock: productData.stock,
              state: +productData.stock > 0 ? 'instock' : 'outofstock',
              old_state: '',
            });
          }
        })
      );
    } catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    } finally {
      prsLoading.dismiss();
      this.loading = false;
      this.applicationRef.tick();
    }
  }

  get calcPrice(): number {
    let total = 0;
    this.productInOderCard.forEach((ele) => (total += ele.qty * +ele.price));
    return total;
  }

  async onConfirmRemoveCard(event: any, productId: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    let customAlert: IPresentAlert = {
      header: 'Confirm Removal',
      message: 'Are you sure you wish to remove this item from the cart?',
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' },
      ],
    };
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == 'yes') {
        this.requestDeleteFromCart(productId, true);
      } else if (res.role == 'no') {
        //Nothing to do
      } else {
        //if WTH
        console.log(':)))');
      }
    });
  }

  onUserBarcodeScanner(): void {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => 
      {
        let text;
        if (this.check_digit_on) 
        {
          text = barcodeData.text;
        } 
        else 
        {
          text = barcodeData.text.substring(0, barcodeData.text.length - 1);
        }
        console.log(text);
        this.inputText.setValue(text);
        this.onSearchProduct();
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  onClickInputQuanity(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async onConfirmSubmitOrder(): Promise<void> {
    if (this.productInOderCard.length < 1) {
      this.sharedService.presentToast('Your cart is empty');
      this.loading = false;
    } else {
      let customAlert: IPresentAlert = {
        header: 'Confirm Order Submission',
        message: 'Are you sure you wish to place this order?',
        buttons: <IButtonType[]>[
          { text: 'Yes', role: 'yes' },
          { text: 'No', role: 'no' },
        ],
      };
      let alert = await this.sharedService.presentAlertConfirm(customAlert);
      alert.onDidDismiss().then((res) => {
        if (res.role == 'yes') {
          this.onSubmitOrder();
        } else if (res.role == 'no') {
          //Nothing to do
        } else {
          //if WTH
          console.log(':)))');
        }
      });
    }
  }

  async onSubmitOrder(): Promise<void> {
    if (this.isInputQuantityNotOK) {
      this.sharedService.presentToast(
        "Can't have no quantity, please remove instead"
      );
      return;
    }
    this.isOrderSubmitted = true;
    try {
      this.updateCartForSubmitting().then(async () => {
        let SubmitData: ISubmit = await this.productService
          .submitOrder(this.email)
          .toPromise();
        if (SubmitData.submit_result == ESubmitResult.Success) {
          this.sharedService.presentToast('Order successfully sent!');
          this.sharedService.navigate('back', 'home');
          this.productService.noteSubject.next('');
          localStorage.removeItem('ordernote');
        } else {
          this.sharedService.presentToast('Error - submit order failure!');
        }
      });
    } catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    } finally {
      this.isOrderSubmitted = false;
    }
  }

  async onRequestSearchProduct(): Promise<void> {
    await this.productService
      .requestSearch(this.inputText.value)
      .toPromise()
      .catch((err) => {
        console.log(JSON.stringify(err));
        this.sharedService.presentToast('Connection failed!');
      });
    let search = this.productService.resultSearchValue;
    if (search.results) {
      this.isShowedDropdown = true;
      this.resultProductsList = JSON.parse(search.results);
    } else {
      this.isShowedDropdown = false;
      this.resultProductsList = [];
    }
  }

  onSearchProduct(): void {
    this.inputText.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.onRequestSearchProduct());
  }

  async addToCart(code: string, qty: string): Promise<void> {
    this.isShowedDropdown = false;
    let check: boolean = this.productInOderCard.some(
      (ele) => ele.mw_code == code
    );

    if (!check) {
      const addToCartData: IAddToCart = {
        email_address: this.email,
        product: code,
        qty: qty,
      };
      this.productService
        .addToCart(addToCartData)
        .toPromise()
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.sharedService.presentToast('Connection failed!');
        });
      this.initCart(false);
    } else {
      this.sharedService.presentToast('This product was already added!');
    }
  }

  async requestDeleteFromCart(
    productId: string,
    isDeleteFromArray: boolean
  ): Promise<void> {
    const usrProduct: IUserProduct = {
      email_address: this.email,
      product: productId,
    };

    let check: boolean = this.productInOderCard.some(
      (ele) => ele.mw_code === productId
    );
    if (check) {
      await this.productService
        .deleteFromCart(usrProduct)
        .toPromise()
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.sharedService.presentToast('Connection failed!');
        });
      if (isDeleteFromArray) {
        this.productInOderCard.forEach((item, index) => {
          if (item.mw_code === productId) {
            this.productInOderCard.splice(index, 1);
          }
        });
        this.initCart(false);
      }
    }
  }

  requestUpdateCart() {
    if (this.productInOderCard.length < 1) {
      this.sharedService.presentToast('Your cart is empty');
      this.loading = false;
    } else {
      this.onUpdateCart();
    }
  }

  async updateCartForSubmitting(): Promise<void> {
    if (this.isInputQuantityNotOK) {
      this.sharedService.presentToast(
        "Can't have no quantity, please remove instead"
      );
      return;
    }
    this.isCartUpdated = true;
    try {
      const clonedData: IOrderCardFull[] = this.productInOderCard.map(
        ({ email_address, old_state, state, stock, price, name, ...item }) =>
          item
      );
      let data: any = await this.productService
        .updateUserCart(this.email, this.noteCartText.value, clonedData)
        .toPromise();
    } catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    } finally {
      this.isCartUpdated = false;
    }
  }

  async onUpdateCart(): Promise<void> {
    if (this.isInputQuantityNotOK) {
      this.sharedService.presentToast(
        "Can't have no quantity, please remove instead"
      );
      return;
    }
    this.isCartUpdated = true;
    try {
      const clonedData: IOrderCardFull[] = this.productInOderCard.map(
        ({ email_address, old_state, state, stock, price, name, ...item }) =>
          item
      );
      let data: any = await this.productService
        .updateUserCart(this.email, this.noteCartText.value, clonedData)
        .toPromise();
      this.sharedService.presentToast('Successfully updated!');
    } catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    } finally {
      this.isCartUpdated = false;
    }
  }

  onLongPressed(
    isDeactivate: boolean,
    productId: string,
    cardState: string
  ): void {
    this.isSelectedMode = !isDeactivate;
    this.isSelectedMode
      ? this.onSelectedCard(productId, cardState)
      : this.deselectedAllCard();
  }

  onSelectedCard(productId: string, cardState: string): void {
    this.productInOderCard = this.productInOderCard.map((ele) => {
      if (ele.mw_code === productId) {
        if (ele.old_state) {
          ele.state = ele.old_state;
          ele.old_state = '';
        } else {
          ele.old_state = cardState;
          ele.state = 'selected';
        }
      }
      return ele;
    });
    this.countSelectedCard();
  }

  deselectedAllCard(): void {
    this.productInOderCard = this.productInOderCard.map((ele) => {
      if (ele.old_state) {
        ele.state = ele.old_state;
        ele.old_state = '';
      }
      return ele;
    });
    this.countSelectedCard();
  }

  onSelectedAll(): void {
    this.productInOderCard = this.productInOderCard.map((ele) => {
      if (!ele.old_state) {
        ele.old_state = ele.state;
        ele.state = 'selected';
      }
      return ele;
    });
    this.countSelectedCard();
  }

  async onDeleteSelected(): Promise<void> {
    const prsLoading: HTMLIonLoadingElement = await this.sharedService.presentLoading();
    await prsLoading.present();
    let usrProduct: IUserProduct = {
      email_address: '',
      product: '',
    };
    try {
      await Promise.all(
        this.productInOderCard.map(async (product) => {
          if (product.state === 'selected') {
            usrProduct = {
              email_address: this.email,
              product: product.mw_code,
            };
            await this.productService.deleteFromCart(usrProduct).toPromise();
            this.productInOderCard.forEach((item, index) => {
              if (item.mw_code === product.mw_code) {
                this.productInOderCard.splice(index, 1);
              }
            });
          }
        })
      );
      this.sharedService.presentToast('Delete successful');
    } catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    } finally {
      prsLoading.dismiss();
      this.isSelectedMode = false;
    }
  }

  async comfirmDeleteSelected(): Promise<void> {
    let customAlert: IPresentAlert = {
      header: 'Confirm Deletion',
      message: 'Delete all selected cards?',
      buttons: <IButtonType[]>[
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' },
      ],
    };
    let alert = await this.sharedService.presentAlertConfirm(customAlert);
    alert.onDidDismiss().then((res) => {
      if (res.role == 'yes') {
        this.onDeleteSelected();
      } else if (res.role == 'no') {
        //Nothing to do
      } else {
        //if WTH
        console.log(':)))');
      }
    });
  }

  countSelectedCard(): void {
    const temp = this.productInOderCard.filter(
      (ele) => ele.state === 'selected'
    );
    this.countSelected = temp.length;
  }
  get isInputQuantityNotOK(): boolean {
    let isNull: boolean = this.productInOderCard.some((obj) => obj.qty == null);
    let isZeroInput: boolean = this.productInOderCard.some(
      (obj) => obj.qty == 0
    );
    return isNull || isZeroInput;
  }

  async updateCartOnGoback() {
    const products = [];
    for (let i in this.productInOderCard) {
      if (this.productInOderCard[i].qty && this.productInOderCard[i].qty > 0) {
        products.push(this.productInOderCard[i]);
      }
    }
    this.productInOderCard = products;
    if (this.productInOderCard.length > 0) {
      await this.updateCartForSubmitting();
    }
  }
}

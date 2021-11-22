import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../../../interface';
import { ProductService, AuthService, SharedService } from '../../../../services';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-bo-details',
  templateUrl: './bo-details.component.html',
  styleUrls: ['./bo-details.component.scss'],
})
export class BoDetailsComponent implements OnInit {
  productData: IProduct = {
    mw_code: '',
    name: '',
    price: '',
    stock: '',
    stocktype_ea_or_bx: '',
    total_results: '',
    image: ''
  };
  imgSrc
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  constructor(
    private route: ActivatedRoute,
    private authenService: AuthService,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    public sharedService: SharedService,) { }

  ngOnInit() {
    this.loadBODetailsData();
  }

  get email(): string {
    return this.authenService.emailValue;
  }
  async loadBODetailsData(): Promise<void> {
    const prsLoading: HTMLIonLoadingElement = await this.sharedService.presentLoading();
    await prsLoading.present();
    try {
      this.productData = await this.productService.getProductInfo(this.route.snapshot.params.id).toPromise();
      this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.productData.image);
      prsLoading.dismiss();
    }
    catch (err) {
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed!');
    }
    finally {
      prsLoading.dismiss();
    }
  }
}

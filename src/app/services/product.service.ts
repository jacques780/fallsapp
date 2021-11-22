import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import {
  IAutoCompleteSearch, IAddToCart,
  IResult, IGetCardResult, IProduct, IUserProduct, ISubmit,
  IOrderCardFull,
  IGetOrderHistoryResult,
} from '../interface';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private autoCSSubject: BehaviorSubject<IAutoCompleteSearch>;
  public noteSubject: BehaviorSubject<string>;

  public resultSearchO: Observable<IAutoCompleteSearch>;
  public noteO: Observable<string>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.autoCSSubject = new BehaviorSubject<IAutoCompleteSearch>({
      results: "",
      total_results: NaN
    });
    this.noteSubject = new BehaviorSubject<string>(localStorage.getItem('ordernote'));

    this.resultSearchO = this.autoCSSubject.asObservable();
    this.noteO = this.noteSubject.asObservable();
  }

  public get resultSearchValue(): IAutoCompleteSearch {
    return this.autoCSSubject.value;
  }

  public get noteValue(): string {
    return this.noteSubject.value;
  }

  requestSearch(input: string): Observable<IAutoCompleteSearch> {
    const data = new HttpParams().set('autocomplete', input);
    return this.http.post<IAutoCompleteSearch>(`${environment.apiUrl}postgetproducts=1`, data).pipe(timeout(5000), map(res => {
      this.autoCSSubject.next(res);
      return res;
    }));
  }

  addToCart(addToCartData: IAddToCart): Observable<IResult> {
    const data = new HttpParams()
      .set('product', addToCartData.product)
      .set('qty', addToCartData.qty)
      .set('email_address', addToCartData.email_address);
    return this.http.post<IResult>(`${environment.apiUrl}addtocart=1`, data).pipe(timeout(5000), map(data => data));
  }

  getUserCard(email: string): Observable<IGetCardResult> {
    const data = new HttpParams().set('email_address', email);
    return this.http.post<IGetCardResult>(`${environment.apiUrl}postgetcart=1`, data).pipe(timeout(5000), map(data => data));
  }

  getProductInfo(code: string): Observable<IProduct> {
    const data = new HttpParams().set('mw_code', code);
    return this.http.post<IProduct>(`${environment.apiUrl}postgetproductinfo=1`, data).pipe(timeout(5000), map(data => data));
  }

  deleteFromCart(uProduct: IUserProduct): Observable<IResult> {
    const data = new HttpParams()
      .set('email_address', uProduct.email_address)
      .set('product', uProduct.product);
    return this.http.post<IResult>(`${environment.apiUrl}postdelcartitem=1`, data).pipe(timeout(5000), map(data => data));
  }

  submitOrder(email: string): Observable<ISubmit> {
    const data = new HttpParams()
      .set('email', email)
      .set('note', this.noteValue);
    return this.http.post<ISubmit>(`${environment.apiUrl}postsubmitorder=1`, data).pipe(timeout(5000), map(data => data));
  }

  getOrderHistory(email: string): Observable<IGetOrderHistoryResult> {
    const data = new HttpParams().set('email_address', email);
    return this.http.post<IGetOrderHistoryResult>(`${environment.apiUrl}postorderhistory=1`, data).pipe(timeout(5000), map(data => data));
  }

  updateUserCart(email: string, note: string, orderCard: IOrderCardFull[]): Observable<any> {
    localStorage.setItem('ordernote', note);
    this.noteSubject.next(note);
    const data = new HttpParams()
      .set('email_address', email)
      .set('ordercart', JSON.stringify(orderCard));
    return this.http.post<any>(`${environment.apiUrl}updatecart=1`, data).pipe(timeout(5000), map(data => data));
  }

  reorder(order_real_id) {
    const data = new HttpParams().set('email_address', this.authService.emailValue).set('order_id_real', order_real_id);
    return this.http.post<IGetOrderHistoryResult>(`${environment.apiUrl}postreorder=1`, data).pipe(timeout(5000), map(data => data));
  }
}

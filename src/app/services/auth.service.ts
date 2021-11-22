import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IAuthen, ILogin } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<IAuthen>;
  private emailSubject: BehaviorSubject<string>;
  public user: Observable<IAuthen>;
  public email: Observable<string>;

  constructor(private http: HttpClient,
    private router: Router,) {
    this.userSubject = new BehaviorSubject<IAuthen>(JSON.parse(localStorage.getItem('data')));
    this.user = this.userSubject.asObservable();

    this.emailSubject = new BehaviorSubject<string>(localStorage.getItem('email'));
    this.email = this.emailSubject.asObservable();
  }
  public get userValue(): IAuthen {
    return this.userSubject.value;
  }

  public get emailValue(): string {
    return this.emailSubject.value;
  }

  loginRequest(login: ILogin) {
    const data = new HttpParams()
      .set('user_name', login.user_name)
      .set('password', login.password);

    return this.http.post<IAuthen>(`${environment.apiUrl}postfallslogin=1`, data).pipe(timeout(5000), map(res => {
      localStorage.setItem('data', JSON.stringify(res));
      localStorage.setItem('email', login.user_name);
      this.userSubject.next(res);
      this.emailSubject.next(login.user_name);
      return res;
    }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('data');
    localStorage.removeItem('email');
    this.userSubject.next(null);
    this.emailSubject.next(null);
    this.router.navigate(['']);
  }
}

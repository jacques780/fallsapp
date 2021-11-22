import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, SharedService } from '../../../services';
import { IAuthen, ILogin } from '../../../interface';
import { ELoginResult } from '../../../enums';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService) { }
  returnUrl: string;
  ngOnInit(): void {
    this.initLoginForm();
    this.checkLoggedIn();
  }

  checkLoggedIn(): void {
    if (this.authService.emailValue && this.authService.userValue) {
      this.sharedService.navigate('forward', '/home');
    }
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      this.sharedService.presentToast('Please specify email address and password!');
      this.loading = false;
      return;
    }

    const userLogin: ILogin = {
      user_name: this.f.username.value, password: this.f.password.value
    }

    await this.authService.loginRequest(userLogin).toPromise().catch((err) => {
      this.loading = false;
      console.log(JSON.stringify(err));
      this.sharedService.presentToast('Connection failed - please check for internet access!');
    });
    let authenData: IAuthen = this.authService.userValue;
    if (authenData.login_result == ELoginResult.Success) 
    {
      // this.sharedService.presentToast('Signed in successfully');
      this.sharedService.navigate('forward', '/home');
      this.loading = false;
    }
    else if (authenData.login_result == ELoginResult.Disabled) {
      this.sharedService.presentToast('Your account is disabled!');
      this.authService.logout();
      this.loading = false;
    }
    else if (authenData.login_result == ELoginResult.NotFound) {
      this.sharedService.presentToast('Login incorrect. For assistance call 800-268-4524 or it@hydesdistribution.com.');
      this.authService.logout();
      this.loading = false;
    }
    else {
      this.sharedService.presentToast('Something went wrong!');
      this.loading = false;
    }
  }
}

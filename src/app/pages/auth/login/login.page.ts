import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import {
  HelperService,
  ApiService,
  AuthService,
} from '../../../services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading = false;
  model: any = {};
  returnUrl: any;
  contacts: any = [];
  passwordType = 'password';
  passwordIcon = 'eye-off';



  constructor(
    public router: Router,
    public menu: MenuController,
    private activatedRoute: ActivatedRoute,
    public helperService: HelperService,
    public apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.helperService.canshowheadersidebar=false;
    this.helperService.toggleMenu();
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }


  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...')
      return;
    }
    this.loading = true;
      this.authService.login(this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.canshowheadersidebar=true;
          this.helperService.presentToast('info','Login Successful','Welcome to PLUS')
          this.apiService.syncDBCache();
          this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
          this.helperService.toggleMenu();

        },
        (err) => {
          this.loading = false;
        }
      );
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


}

import { Component, OnInit, Input } from '@angular/core';
import { HelperService } from 'src/app/services';
import { ApiService, AuthService } from 'src/app/services';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Input() item: any;
  loading=false;
  passmodel: any={};
  model: any={};
  oldPassword1: any;
  currentUser: any;




  constructor(public helperService: HelperService,private router:Router, public apiService: ApiService,public modalController: ModalController,public authService: AuthService ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    console.log( this.currentUser );

  }

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }


  formSubmit($event) {
    console.log(this.model);
    this.model.isPasswordchange = true;
    this.model._id = this.currentUser._id;
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    // console.log( this.passmodel.oldPassword);
    // console.log(this.model.discount_approver.passsword );
    this.loading = true;
    // if(this.model.discount_approver.passsword == this.passmodel.oldPassword){
      this.apiService.callapi(this.apiService.APIS.CHANGE_PASSWORD,this.model)
      .subscribe(
        (res) => {
          console.log(res);
          this.loading = false;
          this.helperService.presentToast('info','Password Changes Saved');
          this.dismiss(true);
          this.logout();
        },
        (err) => {
          this.loading = false;
        }
      );
  }

logout(){

  this.helperService.presentToast('info','Password Changes saved relogin with new password ...')
            this.authService.logout();
            this.helperService.storage_clear();
            setTimeout(() => {
              this.router.navigateByUrl('/auth?salt=' + Math.random(), {
                replaceUrl: true,
              });

            }, 2000);
}

}

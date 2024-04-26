import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';

@Component({
  selector: 'app-user-addedit',
  templateUrl: './user-addedit.page.html',
  styleUrls: ['./user-addedit.page.scss'],
})
export class UserAddeditPage implements OnInit {
  // Data passed in by componentProps
  @Input() item: any;

  model: any={};
  loading=false;
  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService) {}

  ngOnInit() {

    this.model=this.helperService.cloneWR(this.item);
    console.log(this.model);
    console.log(this.model.cn_approvers);

    this.model.passsword='';
    //conditions for dropdowns to set to _ids if there is object
    if (typeof this.model.role != 'string' && this.model.role) { this.model.role=this.model.role._id; }
    if (typeof this.model.region != 'string' && this.model.region) { this.model.region=this.model.region._id; }
    if (typeof this.model.reporting_manager != 'string' && this.model.reporting_manager) { this.model.reporting_manager=this.model.reporting_manager._id; }
    if (typeof this.model.discount_approver != 'string' && this.model.discount_approver) { this.model.discount_approver=this.model.discount_approver._id; }
    if (typeof this.model.ati_approver != 'string' && this.model.ati_approver) { this.model.ati_approver=this.model.ati_approver._id; }
    if (typeof this.model.change_request != 'string' && this.model.change_request) { this.model.change_request=this.model.change_request._id; }
    if (typeof this.model.cancel_request != 'string' && this.model.cancel_request) { this.model.cancel_request=this.model.cancel_request._id; }
    if (typeof this.model.an_approvers != 'string' && this.model.cn_approver) { this.model.cn_approver=this.model.cn_approver[0]; }


  }

  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.USER_ADDEDIT,this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          this.helperService.presentToast('info','Changes Saved');
          this.dismiss(true);
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }

  formValidate($event,cf,$object: any=null){
    let regexp: any;
    let val: any=$event.target.value;
    if(val.length < 1){return 0;}
        switch(cf){
          case 'email':
          regexp= /\S+@\S+\.\S+/;
          console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.email='';
            this.helperService.presentToast('error','Invalid Email Address');
          }
          break;
          case 'mobile':
          regexp= /^([0-9]){8,10}?$/;
          console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.contact_no='';
            this.helperService.presentToast('error','Invalid Mobile Number');
          }
          break;
          case 'name':
          regexp= /^[a-zA-Z\s-, ]+$/;
          console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.name='';
            this.helperService.presentToast('error','Invalid Name');
          }
          break;
        }
      }


 hideShowPassword() {
  this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
}

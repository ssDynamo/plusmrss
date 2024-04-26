import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService } from '../../../services';

@Component({
  selector: 'app-transaction-addedit',
  templateUrl: './transaction-addedit.page.html',
  styleUrls: ['./transaction-addedit.page.scss'],
})

export class TransactionAddeditPage implements OnInit {
  @Input() item: any;

  model: any={};
  loading=false;
  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService) {}

  ngOnInit() {
    this.model=this.helperService.cloneWR(this.item);
  }

  formSubmit($event) {
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    if(!this.model.payment_method){
      this.helperService.presentToast('error','Please Add Payment Method');
      return 0;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.TRANSACTION_ADDEDIT,this.model)
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
            //console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
              $object='';
              this.model.email='';
              this.helperService.presentToast('error','Invalid Email Address');
            }
            break;
            case 'mobile':
            regexp= /^([0-9]){10}?$/;
            //console.log(regexp.test(val));
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
          //console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.name='';
            this.helperService.presentToast('error','Invalid Customer Name');
          }
          break;
          case 'postal-code':
          regexp= /^([0-9]){6}?$/;
          //console.log(regexp.test(val));
          if(regexp.test(val)){
          } else {
            $event.target.value='';
            $object='';
            this.model.postalcode='';
            this.helperService.presentToast('error','Invalid Postal Code');
          }
          break;
          case 'address1':
            regexp= /^[ A-Za-z0-9_@./#&-]*$/;
            //console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
            $object='';
            this.model.address_1='';
            this.helperService.presentToast('error','Invalid Address-line 1');
            }
          break;
          case 'address2':
            regexp= /^[ A-Za-z0-9_@./#&-]*$/;
            //console.log(regexp.test(val));
            if(regexp.test(val)){
            } else {
              $event.target.value='';
            $object='';
            this.model.address_2='';
            this.helperService.presentToast('error','Invalid Address-line 2');
            }
          break;
          case 'number':
            regexp= /^([0-9]){1,5}?$/;
            //console.log(regexp.test(val),'value');
            if(regexp.test(val)){
            }else if(this.model.district){
              $event.target.value='';
              $object='';
              this.model.district='';
              this.helperService.presentToast('error','Invalid District Code');
             }
            else {
              $event.target.value='';
              $object='';
              this.model.no_of_outlets='';
              this.helperService.presentToast('error','Invalid Number of Outlets');
            }
          break;
        }
      }
    }

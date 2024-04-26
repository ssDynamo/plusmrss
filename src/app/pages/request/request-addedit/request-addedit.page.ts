import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiService, HelperService, AuthService } from '../../../services';
import{DatePipe} from '@angular/common';

@Component({
  selector: 'app-request-addedit',
  templateUrl: './request-addedit.page.html',
  styleUrls: ['./request-addedit.page.scss'],
})
export class RequestAddeditPage implements OnInit {
  currentUser: any;
  canshowactionbuttons = false;
  canshow_approvebutton = false;
  canshow_forwardbutton = false;
  model: any = {};
  loading = false;
  payBtn =false;
  showSave : any;
  // Data passed in by componentProps
  @Input() item: any;
  @Input() quotation_cart_index: any;
  cart_item: any = {};

  constructor(
    public modalController: ModalController,
    public apiService: ApiService,
    public authService: AuthService,
    public helperService: HelperService,
    private datePipe: DatePipe,
    public alertController:AlertController
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.item) {
      this.model = this.item;
      if(!this.model.remark){
        this.model.remark = [];
      }
      //console.log(this.model);
      //console.log(this.quotation_cart_index);
      if(this.quotation_cart_index || this.quotation_cart_index == 0){
        
        this.model.quotation_cart_index = this.quotation_cart_index;
      }
      this.cart_item = this.model.quotation.items[this.quotation_cart_index];

      this.model.payment_date = this.datePipe.transform(this.model.payment_date, 'yyyy-MM-dd');
      if(this?.model?.fromUser?._id == this?.authService?.currentUserValue?._id && this.model.status == 'pending' && this?.model?.fromUser?._id != this?.model?.toUser?._id && this.model?.type!='cn'){
          this.showSave = true;
      }
      if(this.model?.fromUser?._id != this?.authService?.currentUserValue?._id && this.model.payment_date){
        this.payBtn =true;
      }
      let flagnew = false;

      if (!this.model?.fromUser) {
        this.showSave = true;
        flagnew = true;
        this.model.fromUser = this.item.quotation.user;
      } else {
        if (this?.model?.toUser?._id == this?.authService?.currentUserValue?._id && (this.model.status == 'pending' || this.model.status == 'forward')) {
          this.canshowactionbuttons = true;
        }
      }

      //get approvers from Users
      let uc = this.apiService.DBCache['USER_LIST'].filter(
        (el) => el._id == this.model.fromUser._id
      )[0];
      //console.log(this.model.type);

      let CR_APPROVERS = uc[this.model.type + '_approvers'];
      let CR_LIMIT = uc.role[this.model.type + '_limit'];

      //console.log(uc,CR_APPROVERS);

      if (CR_APPROVERS.length < 1) {
        this.helperService.presentToast('error', 'No Approvers Set');
        this.dismiss(false);
        return false;
      }

      if (this.model.type != 'discount') {
        this.model.value = this.model.quotation.total;
      }

      if(flagnew){
        this.model.toUser=CR_APPROVERS[0];
      }

      //check if from user has limit
      if ( this.authService.currentUserValue.role[this.model.type + '_limit'] >= this.model.value || this.model.type=='cn') 
      {
        this.canshow_approvebutton = true;
      } else {
        this.canshow_forwardbutton = true;
        //set next approver

        let crti=CR_APPROVERS.findIndex(el=>el._id==this.model.toUser._id);
        //console.log(crti);
        if(!flagnew ){
          this.model.toUser=CR_APPROVERS[crti+1];
        }
      }
    }
  }

  dismiss(refresh = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data

    this.modalController.dismiss({
      dismissed: true,
      refresh: refresh,
      item: this.model,
    });
  }
  form_actions() {
    switch (this.model.status) {
      case 'forward':
        // this.model.toUser = this.currentUser?.discount_approver;
        break;
    }
  }
  async formSubmit($event) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {                         
            //run form actions
            
            if (this.loading) {
              this.helperService.presentToast('info', 'Please wait...');
              return;
            }
            this.loading = true;
            //save remark
            if(this.model.remarkmsg){
              let remark = {
                'remark': this.model.remarkmsg,
                'user': this.currentUser,
                'status': this.model.status,
              };
              this.model.remark.push(remark);
            }
            this.apiService
              .callapi(this.apiService.APIS.REQUEST_ADDEDIT, this.model)
              .subscribe(
                (res) => {
                  this.loading = false;
                  this.helperService.presentToast('info', 'Request Added');
                  this.dismiss(true);
                },
                (err) => {
                  this.loading = false;
                }
              );
          },
        },
      ],
    });

    await alert.present();

  }
}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService, HelperService,AuthService } from '../../../services';



@Component({
  selector: 'app-creditnote-addedit',
  templateUrl: './creditnote-addedit.component.html',
  styleUrls: ['./creditnote-addedit.component.scss'],
})
export class CreditnoteAddeditComponent implements OnInit {
  @Input() quotation: any = {};
  @Input() log_creditnotes: any = {};
  @Input() data: any ={};
  model : any={};
  cnmodel : any={};
  isChecked: any;
  showSave : any;
  payBtn =false;
  @Input() item: any;
  canshowactionbuttons = false;



  disable_credit_note_button: boolean = true;
  loading=false;
  canshow_approvebutton: boolean;
  canshow_forwardbutton: boolean;


  constructor(public modalController: ModalController,public apiService: ApiService,public helperService: HelperService,public authService:AuthService) { }

  ngOnInit() {
    if(this.data){
      this.cnmodel.quotation = this.data;
    }
    if(this.quotation){
      this.model.quotation=this.quotation;
      this.model.type='cn';
      console.log(this.quotation);
    }
    if(this.log_creditnotes.length>0){
      this.log_creditnotes=this.log_creditnotes;
      this.model.quotation.items = this.log_creditnotes[0].items;
    }
    if(this?.model?.fromUser?._id == this?.authService?.currentUserValue?._id && this.model.status == 'pending' && this?.model?.fromUser?._id != this?.model?.toUser?._id){
      this.showSave = true;
  }
  if(this.model?.fromUser?._id != this?.authService?.currentUserValue?._id && this.model.payment_date){
    this.payBtn =true;
  }
  let flagnew = false;

  if (!this.model?.fromUser) {
    this.showSave = true;
    flagnew = true;
    this.model.fromUser = this.model.quotation.user;
  } else {
    if (this?.model?.toUser?._id == this?.authService?.currentUserValue?._id && (this.model.status == 'pending' || this.model.status == 'forward')) {
      this.canshowactionbuttons = true;
    }
  }
  let uc = this.apiService.DBCache['USER_LIST'].filter(
    (el) => el._id == this.model.fromUser._id
  )[0];
  console.log(this.model.type);

  let CR_APPROVERS = uc[this.model.type + '_approvers'];
  let CR_LIMIT = uc.role[this.model.type + '_limit'];

  console.log(uc,CR_APPROVERS);

  if (CR_APPROVERS.length < 1) {
    this.helperService.presentToast('error', 'No Approvers Set');
    this.dismiss(false);
    return false;
  }

  if(!this.model.remark){
    this.model.remark = [];
  }

  if(flagnew){
    this.model.toUser=CR_APPROVERS[0];
  }

  //check if from user has limit
  if ( this.authService.currentUserValue.role[this.model.type + '_limit'] >= this.model.value)
  {
    this.canshow_approvebutton = true;
  } else {
    this.canshow_forwardbutton = true;
    //set next approver

    let crti=CR_APPROVERS.findIndex(el=>el._id==this.model.toUser._id);
    console.log(crti);
    if(!flagnew ){
      this.model.toUser=CR_APPROVERS[crti+1];
    }
  }
  
    this.model.quotation.items.filter(i=> {
      if(i.is_creditnote == true){
        i.disabled = true;
      }else{
        i.disabled = false;
      }
    });
    console.log(this.model.quotation.items);

    let cn = this.model.quotation.items.filter(i=>i.disabled == false);
    if(cn.length>0){
      this.disable_credit_note_button = false;
    }
  }
  check(e,i){
    if(e.detail.checked == true){
      this.model.quotation.items[i].is_creditnote =true;
      console.log(this.model);
    }else {
      this.model.quotation.items[i].is_creditnote =false;

    }
  }
  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }
  Requestsubmit($event){
    // console.log(this.model)
    
    if (this.loading) {
      this.helperService.presentToast('info', 'Please wait...');
      return;
    }
    this.model.items=this.model.quotation.items;
    console.log(this.model);
    let temp_is_cn = this.model.items.filter(i=> i.is_creditnote);
    console.log(temp_is_cn);
    if(temp_is_cn.length ==0 ){
      this.helperService.presentToast('info', 'Select Atleast one.');
      return;
    }

    if(this.model.remarkmsg){
      let remark = {
        'remark': this.model.remarkmsg,
        'user': this.model.fromUser,
        'status': 'pending',
      };
      this.model.remark.push(remark);
    }
    this.loading = true;
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

  }
  form_actions() {
    throw new Error('Method not implemented.');
  }

  formSubmit($event) {
    let cmodel:any={};
    cmodel.quotation = this.model.quotation._id;
    cmodel.quotation_idseq = this.model.quotation.idseq;
    cmodel.items =this.model.quotation.items;
    var sub_total=0
    for(let i=0;i<this.model.quotation.items.length;i++){
         if(this.model.quotation.items[i].is_creditnote == true && this.model.quotation.items[i].disabled == false){
           sub_total=sub_total + this.model.quotation.items[i].cart_total_sub;
         }
    }
    
    cmodel.sub_total = sub_total;
    cmodel.gst = 7;
    cmodel.gst_amount = (sub_total*7)/100;
    cmodel.cn_amount = cmodel.sub_total + cmodel.gst_amount;
    cmodel.customer=this.model.quotation.customer._id;
    cmodel.customer_name=this.model.quotation.customer.name;

    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }

    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.CREDIT_ADDEDIT,cmodel)
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

}

import { Component, OnInit ,Input} from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-refund-addedit',
  templateUrl: './refund-addedit.component.html',
  styleUrls: ['./refund-addedit.component.scss'],
})
export class RefundAddeditComponent implements OnInit {
  @Input() item: any;
  model: any={};
  id:any
  loading=false;
  filtered_credit_list: any;
  tempCreditNote: any;
  refundCredit:any =[];
  constructor(  private apiService: ApiService,
  public helperService: HelperService,public modalController: ModalController) { }

  ngOnInit() {
    if (this.item) {
      this.model=this.item;
      this.model.creditno=this.model.creditnote?.creditno;
    }
    //console.log(this.model);
    this.getRefundCreditList();

  }


  selectCredit(id){
    //console.log(id);
     this.tempCreditNote = this.apiService.DBCache['CREDIT_LIST'].filter(
     (el) => el._id == id
   );
      //console.log(this.tempCreditNote);
      this.model.customer_name = this.tempCreditNote[0].customer.name;
      this.model.customer = this.tempCreditNote[0].customer._id;
      this.model.creditnote_idseq = this.tempCreditNote[0].idseq;
      this.model.creditno=this.tempCreditNote[0].creditno;
      this.model.amount = this.tempCreditNote[0].cn_amount;
  }

  formValidate($event, cf, $object: any = null) {
    let regexp: any;
    let val: any = $event.target.value;
    if (val.length < 1) {
      return 0;
    }
    switch (cf) {
      case 'email':
        regexp = /\S+@\S+\.\S+/;
        //console.log(regexp.test(val));
        if (regexp.test(val)) {
        } else {
          $event.target.value = '';
          $object = '';
          this.model.email = '';
          this.helperService.presentToast('error', 'Invalid Email Address');
        }
        break;
      case 'chequeno12':
        regexp = /^[0-9a-zA-Z\s-_, ]+$/;
        //console.log(regexp.test(val));
        if (regexp.test(val)) {
        } else {
          $event.target.value = '';
          $object = '';
          this.model.contact_no = '';
          this.helperService.presentToast('error', 'Invalid Cheque Number');
        }
        break;
      case 'name':
        regexp = /^[a-zA-Z\s-, ]+$/;
        //console.log(regexp.test(val));
        if (regexp.test(val)) {
        } else {
          $event.target.value = '';
          $object = '';
          this.model.name = '';
          this.helperService.presentToast('error', 'Invalid Name');
        }
        break;
    }
  }

  formSubmit($event) {
    //console.log(this.model);
    if(this.loading){
      this.helperService.presentToast('info','Please wait...');
      return;
    }
    this.loading = true;
      this.apiService.callapi(this.apiService.APIS.REFUND_ADDEDIT,this.model)
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
  getRefundCreditList(){
    this.apiService.callapi(this.apiService.APIS.REFUND_CREDITLIST).subscribe(res=>{
      this.refundCredit =res.data;

    });
  }


}

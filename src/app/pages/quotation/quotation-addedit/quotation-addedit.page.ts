import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModalController,AlertController, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditnoteAddeditComponent } from '../../creditnote/creditnote-addedit/creditnote-addedit.component';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuotationCreditnoteComponent } from '../../public/quotation-creditnote/quotation-creditnote.component';



import { ApiService, AuthService, HelperService } from '../../../services';
import { QuotationCartitemAddeditPage } from '../quotation-cartitem-addedit/quotation-cartitem-addedit.page';

import { RequestAddeditPage } from '../../request/request-addedit/request-addedit.page';
import { TransactionAddeditPage } from '../../transaction/transaction-addedit/transaction-addedit.page';
import { LogViewPage } from '../../log/log-view/log-view.page';
import { QuotationCartitemBulkUploadPage } from '../quotation-cartitem-bulkupload/quotation-cartitem-bulkupload.page';
@Component({
  selector: 'app-quotation-addedit',
  templateUrl: './quotation-addedit.page.html',
  styleUrls: ['./quotation-addedit.page.scss'],
})
export class QuotationAddeditPage implements OnInit {
  currentTabIndex = 0;
  currentUser:any;

  log_discountrequests:any=[];
  log_transactions:any;
  canshow_discountrequestbox=false;
  var_maxdiscount=0;
  var_applyDiscountModel;

  @Input() item: any = {};

  public customers$:any=[];
  public customerinput$ = new Subject<any | null>();

  model: any = {};
  loading = false;
  tabs=["Customer Details","Cart Items","Billing"];
  itemLength= false;
  localLength = true;
  log_changepirequests: any;
  log_cancelpirequests: any;
  log_creditnotes: any;
  log_atirequests: any;
  atiBtn: any;
  discountBtn: boolean;
  action: any;
  pi_renewalqid:any;
  pi_renewalqidseq: any;
  fileName: any;
  log_evidence: any;
  remainingPayment: any = 0;
  remainingPaymentSurplus:any=0;

  dis_applied = false;
  log_cnrequests: any;
  
  constructor(
    private changeDetection: ChangeDetectorRef,
    public modalController: ModalController,
    public apiService: ApiService,
    public authService: AuthService,
    public helperService: HelperService,
    private activatedRoute: ActivatedRoute,
    public alertController:AlertController,
    public actionSheetController:ActionSheetController
  ) {


  }

  ngOnInit() {
    //console.log(this.item);
    //this.model=this.helperService.cloneWR(this.item);
    let c=this.customerinput$.pipe(
      map((term) => this.autocompletelist_customers(term))
    )

    let today = new Date();
  var  year = today.getFullYear();

  if(year == 2022){
this.model.gst_percentage=7 ;
  }else{
    this.model.gst_percentage=8 ;
  }
    //conditions for dropdowns to set to _ids if there is object
    //if (typeof this.model.role != 'string' && this.model.role) { this.model.role=this.model.role._id; }
  }

  ionViewDidEnter() {
    this.currentUser = this.authService.currentUserValue;
    this.setItem();
  }

  async setItem(){

    let _id = this.activatedRoute.snapshot.queryParams['_id'];
    if(_id == undefined) {
      this.itemLength = true;
    }else {
      this.itemLength = false;
    }
    if (_id) {
      this.loading=true;
      let state: any = window.history.state;
      //console.log('state', state);
      if(state?.item?._id && false){
      this.item = this.helperService.cloneWR(state.item);
        if(this.item.items.length == 0){
            this.itemLength = true;
        }else {
          this.itemLength = false;
        }
      }
      else {
        await this.getSetItemById(_id);
      }

      this.model = this.helperService.cloneWR(this.item);

      this.action = this.activatedRoute.snapshot.queryParams['action'];

      if(this.action && this.action === 'piRenewal'){
        this.model.discount_percentage = 0;
        this.model.total = this.model.total + this.model.total_discount;
        this.model.total_discount = 0;


        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i=0; i < this.model.items.length; i++){

          let start_date= this.model.items[i].start_date;
          let end_date=  this.model.items[i].end_date;
          const days = this.date_diff(start_date,end_date);
          //console.log(days);
          let new_start_date = new Date(end_date);
          new_start_date.setDate(new_start_date.getDate() + 1) ;

          var new_end_date = new Date(new_start_date);
          new_end_date.setDate(new_end_date.getDate() + days);

          this.model.items[i].start_date=new_start_date;
          this.model.items[i].end_date=new_end_date;
          this.model.items[i].old_start_date= start_date;
          this.model.items[i].old_end_date= end_date;
        }
      }

      setTimeout(()=>{
        this.loading=false;
      },1000);


      //if (typeof this.model.customer != 'string' && this.model.customer) { this.model.customer=this.model.customer._id; }
      //if (typeof this.model.user != 'string' && this.model.user) { this.model.user=this.model.user._id; }
      //}

      this.listRequests();
      this.listTransactions();
      this.listCreditNote();
      this.listEvidancefile();
      this.calculateRemaining();

    }
  }

  async getSetItemById(_id){

  let r = await this.apiService.callapi(this.apiService.APIS.QUOTATION_LIST,{_id:_id}).toPromise();
  //console.log('item fetched');
  this.item=r.data[0];
  //console.log(this.item);

  }

  segmentChanged($event){
    //this.currentTabIndex=parseInt($event.detail.value);
  }

  formSubmit() {
    //console.log(this.model);
    if (this.loading) {
      this.helperService.presentToast('info', 'Please wait...');
      return;
    }
    if(!this.model.customer){
      this.helperService.presentToast('error', 'Please select Customer ');
      return 0;
    }
    if(!this.model.user){
      this.helperService.presentToast('error', 'Please select LeadOwner');
      return 0;
    }

    if(this.model.gst_percentage != this.model.items[0].gst_percentage){
      this.helperService.presentToast('error', 'You Could not changes Gst percentage');
      return 0;
    }
    // if(this.model.items.length == 0){
    //   this.helperService.presentToast('info', 'Please Select Cart Item');
    //   return 0;
    // }
    this.action = this.activatedRoute.snapshot.queryParams['action'];
    this.pi_renewalqid = this.model._id;
    this.pi_renewalqidseq = this.model.idseq;
    if( this.action &&  this.action === 'piRenewal'){
      delete this.model.pi_no;
      delete this.model.invoice_no;
      delete this.model.invoice_date;
      delete this.model.paid_on;
      delete this.model.idseq;
      delete this.model._id;
      this.model.status='pending';
      this.model.pi_type="renewal";
    }

    this.loading = true;
    this.apiService
      .callapi(this.apiService.APIS.QUOTATION_ADDEDIT, this.model)
      .subscribe(
        (res) => {
          this.loading = false;
          //this.helperService.is_new_item_added_cart = false;
          localStorage.removeItem('is_new_item_added_cart');
          this.helperService.presentToast('info', 'Changes Saved');
          this.model._id=res.data._id;
          this.model.idseq=res.data.idseq;
          this.model.status=res.data.status;
          this.model.pi_no=res.data.pi_no;
          this.model.createdAt=res.data.createdAt;

          if( this.action === 'piRenewal'){
            this.apiService
            .callapi(this.apiService.APIS.QUOTATION_ADDEDIT,{_id:this.pi_renewalqid,idseq:this.pi_renewalqidseq, is_renewal:true,renewalpi:res.data._id,renewal_idseq:res.data.idseq}).subscribe(res=>{
              this.helperService.presentToast("Info","PI Renewal is Successfull");
            })

          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  dismiss(refresh = false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      refresh: refresh,
    });
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
      case 'mobile':
        regexp = /^([0-9]){10}?$/;
        //console.log(regexp.test(val));
        if (regexp.test(val)) {
        } else {
          $event.target.value = '';
          $object = '';
          this.model.contact_no = '';
          this.helperService.presentToast('error', 'Invalid Mobile Number');
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

  canGo(dir) {
    let flag = true;

    if(this.currentTabIndex < 1 && dir=='prev'){
      flag=false;
    }
    if(this.currentTabIndex > 1 && dir=='next'){
      flag=false;
    }

    return flag;
  }

  go(dir) {
      if(dir=='prev'){
        this.currentTabIndex--;
      }
      else if(dir=='next'){
        this.currentTabIndex++;
      }
  }

  autocompletelist_customers(term){
     this.apiService.callapi(this.apiService.APIS.CUSTOMER_LIST,{q:term}).subscribe((res)=>{
        this.customers$=res.data;
     });

   return [];
      // const searchTerm = term ? term : '';
      // return [
      //   { name: 'Jack Doe' },
      //   { name: 'Jane Doe' },
      //   { name: 'John Doe' },
      // ].filter((person) => {
      //   return person.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      // });

  }

  async presentCartitemBulkUploadModal(item:any=null,i=-1) {
    if(!item){
      item={};
      item.licensee=this.helperService.cloneWR(this.model.customer);
    } else {
      if(!item.licensee){
       item.licensee=this.helperService.cloneWR(this.model.customer);
      }
    }
    if(!this.model.gst_percentage){

      this.helperService.presentToast('error','Select Atleast One gst percent');
      return 0;

     }

     if(this.model.items && this.model.items[0].gst_percentage != this.model.gst_percentage){
      
      this.helperService.presentToast('error','You Cloud not change the gst percentage');
      return 0;
     }
     item.gst_percentage=this.model.gst_percentage;
    const modal = await this.modalController.create({
      // enableBackdropDismiss: false,
      component: QuotationCartitemBulkUploadPage,
      cssClass: 'cartitem-bulkupload-page',
      componentProps: {
        item: this.helperService.cloneWR(item),
      },
    });

    modal.onDidDismiss().then((res:any) => {
      //const user = data['data']; // Here's your selected user!
      //console.log(res);
      if(!this.model.items){
        this.model.items=res.data.item;
        this.localLength = false;
       }else{

          this.model.items = this.model.items.concat(res.data.item);
          localStorage.setItem('is_new_item_added_cart', 'true');
          this.localLength = false;
       }
       this.refreshItems();
    });


    return await modal.present();
  }

  async presentCartitemAddeditModal(item:any=null,i=-1) {
       if(!item){
         item={};
         item.licensee=this.helperService.cloneWR(this.model.customer);
       } else {
         if(!item.licensee){
          item.licensee=this.helperService.cloneWR(this.model.customer);
         }
       }
       if(!this.model.gst_percentage){

        this.helperService.presentToast('error','Select Atleast One gst percent');
        return 0;

       }

       if(this.model.items && this.model.items[0].gst_percentage != this.model.gst_percentage){
        
        this.helperService.presentToast('error','You Cloud not change the gst percentage');
        return 0;
       }

       item.gst_percentage=this.model.gst_percentage;
       //console.log(item);
    const modal = await this.modalController.create({
      // enableBackdropDismiss: false,
      component: QuotationCartitemAddeditPage,
      cssClass: 'cartitem-addedit-page',
      componentProps: {
        item: this.helperService.cloneWR(item),
      },
    });

    modal.onDidDismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!
    //console.log(res.data);
     if(res.data?.refresh){
     if(!this.model.items){
        this.model.items=[];
        this.localLength =true;
     }

     if(item && i>-1){
      this.model.items[i]=res.data.item;
     }else{
        this.model.items.push(res.data.item);
        localStorage.setItem('is_new_item_added_cart', 'true');
        this.localLength = false;
     }
    }
    //console.log(localStorage.getItem('is_new_item_added_cart'));

    this.refreshItems();
    });


    return await modal.present();
  }

  async presentRequestAddEditModal(type,index:any=0,item:any={}){
    if(!item._id){
    //New Request
    item.type=type;
    if(this.model._id){
      item.quotation=this.model;
    }else{
      this.helperService.presentToast("Info","Please SAVE the quotation");
      return 0;
    }
    //item.fromUser=this.model.user._id;


    // if(type == 'discount'){
    //   item.toUser=this.authService.currentUserValue.discount_approvers[0];
    //   item.status='pending';
    // }else if(type == 'change'){
    //   item.toUser=this.authService.currentUserValue.change_request;
    //   item.status='pending';
    // }else if(type == 'cancel'){
    //   item.toUser=this.authService.currentUserValue.cancel_request;
    //   item.status='pending';
    // }

    }

    const modal = await this.modalController.create({
      component: RequestAddeditPage,
      cssClass: 'request-addedit-page',
      componentProps: {
        item: this.helperService.cloneWR(item),
        quotation_cart_index: index
      },
    });

    modal.onDidDismiss().then((res:any) => {``
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
     this.listRequests();
    }
    });


    return await modal.present();
  }

  async presentTransactionAddEditModal(item:any={}){


    if(!item._id){
      //New Request
      item.type='credit';
      if(this.model._id){
        item.quotation=this.model._id;
      }else{
        this.helperService.presentToast("Info","Please SAVE the quotation first");
        return 0;
      }
      item.status='pending';
      }


    const modal = await this.modalController.create({
      component: TransactionAddeditPage,
      cssClass: 'transaction-addedit-page',
      componentProps: {
        item: this.helperService.cloneWR(item),
      },
    });

    modal.onDidDismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
     this.listTransactions();
    }

    });


    return await modal.present();
  }

  async presentCreditPopup(data:any={},type){
    data.type =type;
    const modal = await this.modalController.create({
      component: CreditnoteAddeditComponent,
      cssClass: 'credtinote-addedit-page',
      componentProps: {
        data: this.helperService.cloneWR(data),
      },
    });

    modal.onDidDismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
    this.listCreditNote();
     }

    });

    return await modal.present();

  }

  async presentCreditAddEditModal(){
    //console.log('ccadde',this.model);
    const modal = await this.modalController.create({
      component: CreditnoteAddeditComponent,
      cssClass: 'credtinote-addedit-page',
      componentProps: {
        quotation: this.helperService.cloneWR(this.model),
        log_creditnotes: this.helperService.cloneWR( this.log_creditnotes),
      },
    });

    modal.onDidDismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
    this.listCreditNote();
     }

    });

    return await modal.present();

  }

  async confirmCreditNote(){
    let resolveLeaving;
    // const canLeave = new Promise<boolean>(resolve => resolveLeaving = resolve);
    const alert = await this.alertController.create({
      header: 'Confirm  Credit Note',
      message: '<p><b><center>Are you sure to Create Credit Note?</center></b></p></p><br><center><p><b>Once Created Credit Notes Can not be Deleted , This Action is NOT Reversible.</b></p></center>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',

          handler: () => {
            resolveLeaving(false);
          }
        },
        {
          text: 'Yes Proceed To Create',
          handler: () => {
            //console.log("*********");
            //console.log(this.model);
            this.presentCreditAddEditModal();            //this.formSubmit(null);
          }
        }
      ]
    });
    alert.present();
  }
  
  refreshItems(){
    //console.log(this.model);
    if(this.model.items){
      let subtotal=0;
      let gsttotal=0;
      let discounttotal=0;
      let total:any=0;

      let gst_percentage=this.model.gst_percentage;
      let discount_percentage=this.model.discount_percentage;
      this.model.items.forEach(element => {

            subtotal=subtotal+element.cart_total_sub;
            gsttotal=gsttotal+element.cart_total_gst;
            total=total+element.cart_total;
            gst_percentage=element?.gst_percentage;

      });


      if(!this.model.discount_percentage){
        this.model.discount_percentage=0;
      }else{
        this.model.discount_percentage=this.helperService.TrimNumberToDecimals(this.model.discount_percentage);
      }

      let discount = this.helperService.TrimNumberToDecimals(subtotal * this.model.discount_percentage /100);
      let tempsubtotal=subtotal-discount;

      let gst=tempsubtotal * gst_percentage / 100;
      gsttotal=this.helperService.TrimNumberToDecimals(gst);

      total=this.helperService.TrimNumberToDecimals(tempsubtotal+gsttotal);
      //console.log(subtotal,tempsubtotal,gst,total);


      this.model.total=this.helperService.TrimNumberToDecimals(total);
      this.model.total_sub=subtotal;
      this.model.total_gst=gsttotal;
      this.model.total_discount=discount;
      this.model.gst_percentage=gst_percentage;
      //this.model.discount_percentage=discount_percentage;

      //Discount Apply Login
      this.calculateRemaining();

    }
  }





  async presentCartDeleteConfirm(index) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure ?',
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
            this.helperService.presentToast('info','Clearing Cart Item...');
            this.model.items.splice(index,1);
            this.refreshItems();
          },
        },
      ],
    });

    await alert.present();
  }

  listRequests(){
    if(this.action != 'piRenewal'){
    this.apiService.callapi(this.apiService.APIS.REQUEST_LIST,{quotation:this.model._id,limit:1000}).subscribe(res=>{
      this.log_discountrequests = res.data.filter(a=>a.type == 'discount');
      this.log_discountrequests.filter(r=>{
        r['var_applyDiscountModel'] = 0;
      })
      if(this?.log_discountrequests[0]?.status == 'approved'){
        this.dis_applied=true
      }
      this.log_changepirequests = res.data.filter(a=>a.type == 'changepi');
      this.log_cancelpirequests =res.data.filter(a=>a.type == 'cancelpi');
      this.log_atirequests = res.data.filter(a=>a.type == 'ati');
      this.log_cnrequests = res.data.filter(a=>a.type == 'cn');
     if(this?.log_atirequests[0]?.status == 'approved'){
       this.discountBtn = true;
     }



      //canshow_discountrequestbox
      if(res.data){

        let r=this.log_discountrequests.filter(el=>el.status=='approved')[0];
        if(r?.value>0){
          this.canshow_discountrequestbox=true;
          this.var_maxdiscount=r.value;
        }
      }

      });
    }
  }




  listTransactions(){
    if(this.action != 'piRenewal'){
      this.apiService.callapi(this.apiService.APIS.TRANSACTION_LIST,{quotation:this.model._id}).subscribe(res=>{
        this.log_transactions=res.data;
        this.calculateRemaining();
      });
    }

  }

  listCreditNote(){
    if(this.action != 'piRenewal'){
      this.apiService.callapi(this.apiService.APIS.CREDIT_LIST,{quotation:this.model._id}).subscribe(res=>{
        this.log_creditnotes=res.data;
        //console.log(this.log_creditnotes);
      });
    }
  }

  listEvidancefile(){
    if(this.action != 'piRenewal'){
      this.apiService.callapi(this.apiService.APIS.EVIDENCE_LIST,{quotation:this.model._id,limit:100}).subscribe(res=>{
        this.log_evidence=res.data;
        //console.log(this.log_evidence);
      });
    }
  }


  applyCartDiscount(cartItem, requestObj){

    let cart_total_without_discount = cartItem.cart_total_sub
    let cart_discount_percentage = requestObj.var_maxdiscount;

    if(!cart_discount_percentage){
      cart_discount_percentage=0;
    }else{
      cart_discount_percentage=this.helperService.TrimNumberToDecimals(cart_discount_percentage);
    }

    let discount = this.helperService.TrimNumberToDecimals(cart_total_without_discount * cart_discount_percentage /100);

    cartItem.cart_total_sub=cartItem.cart_total_sub-discount;
    cartItem.discount = discount;

    this.model.items[requestObj.quotation_cart_index]['cart_total_without_discount'] = cart_total_without_discount;
    this.model.items[requestObj.quotation_cart_index]['cart_discount_percentage'] = cart_discount_percentage;
    this.model.items[requestObj.quotation_cart_index]['cart_total_sub'] = cartItem.cart_total_sub;
    this.model.items[requestObj.quotation_cart_index]['discount'] = cartItem.discount;
    //console.log(this.model);
    this.refreshItems();
    this.helperService.presentToast("info","Discount Applied - Please Save Changes");
  }

  get_discountRequestLog(index){
    let r = [];
    r = this.log_discountrequests.filter(a=>a.quotation_cart_index == index);
    //console.log(r);
    if(r.length>0){
      if(r[0].value>0){
        r[0]['canshow_discountrequestbox'] = true;
        r[0]['var_maxdiscount'] = r[0].value;
      }
    }


    return r;

  }

  applyDiscount(){
    //validations
    if(this.var_applyDiscountModel > this.var_maxdiscount){
      this.var_applyDiscountModel=this.var_maxdiscount;
    }

    this.model.discount_percentage=this.var_applyDiscountModel;

    this.refreshItems();
    this.helperService.presentToast("info","Discount Applied - Please Save Changes");

  }

//   prepareCartItemForDiscount(citem){
//     let gst_p=7;
//     //this.model.cart_total_sub = this.helperService.TrimNumberToDecimals(this.model.cart_total_sub);
//     if(!this.model.discount_percentage){this.model.discount_percentage=0;}else{this.model.discount_percentage=this.helperService.TrimNumberToDecimals(this.model.discount_percentage);}
//       //Apply Discount on Sub
//       let discount = citem.cart_total_sub * this.model.discount_percentage /100;
//       citem.cart_total_sub_withoutdiscount=citem.cart_total_sub;
//       citem.cart_total_sub_withdiscount=this.helperService.TrimNumberToDecimals(citem.cart_total_sub-discount);
// //      citem.cart_total_sub=citem.cart_total_sub_withdiscount;

//     let gsttotal:any=citem.cart_total_sub*gst_p/100;
//     citem.gst_percentage=gst_p;
//     citem.cart_total_gst=this.helperService.TrimNumberToDecimals(gsttotal);
//     citem.cart_total=this.helperService.TrimNumberToDecimals(gsttotal+citem.cart_total_sub);

//   }

presentCustomerListModal(){

}


async presentLogViewModal(){
   let item= this.helperService.cloneWR(this.model);
  if(!item._id){

  if(this.model._id){
    item.quotation=this.model;
  }else{
    this.helperService.presentToast("Info","Please SAVE the quotation");
    return 0;
  }


  }

  const modal = await this.modalController.create({
    component: LogViewPage,
    cssClass: 'log-view-page',
    componentProps: {
      item: this.helperService.cloneWR(item),
    },
  });

  modal.onDidDismiss().then((res:any) => {``
   //const user = data['data']; // Here's your selected user!

   if(res.data?.refresh){

  }
  });


  return await modal.present();
}

handleFileInput($event){
  let files=$event.target?.files;
  this.helperService.presentToast("info","Uploading File");
  this.fileName = files[0].name;
  const exte = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
 // console.log(exte);
  // const file = this.fileName.slice(0, this.fileName.lastIndexOf('.'));
  // console.log(file);
  let ext=exte.toLowerCase();
  //if(ext == 'jpeg' || ext == 'jpg' ||ext =='png' ){
    this.apiService.uploadFile(files[0])
    .subscribe(res => {
      // console.log(res);
       this.helperService.presentToast("info","Evidence File Uploaded Successfully");
       if(res.data){
          res.quotation=this.model._id;
          res.quotation_idseq=this.model.idseq;
          res.file_path=res?.data?.path;
          this.addsaveevidencefile(res);
       }
       //this.runimport(res?.data);
    });
  // } else {
  //   this.helperService.presentToast("error","Please Upload Only Jpeg ,jpg, png File");
  // }
}

addsaveevidencefile(r){

  this.apiService.callapi(this.apiService.APIS.EVIDENCE_ADDEDIT,r).subscribe(res=>{
    //console.log(res);
    this.listEvidancefile();

   //this.helperService.presentToast("info","Evidence File Uploaded Successfully");
   //this.validStatement = true;
   ///this.filter();
  },
  (err) => {
   this.loading = false;
 }
  );
}

async confirmevidence(evd){
  let resolveLeaving;
  //console.log(evd);
  // const canLeave = new Promise<boolean>(resolve => resolveLeaving = resolve);
  const alert = await this.alertController.create({
    header: 'Confirm  Delete ',
    message: '<p><b><center>Are you sure , You want delete Evidence File?</center></b></p><br><center><p><b>Once Deleted , This Action is NOT Reversible.</b></p></center>',
    buttons: [
      {
        text: 'No',
        role: 'cancel',

        handler: () => {
          //resolveLeaving(false);
          console.log("confimrcancel");
        }
      },
      {
        text: 'Yes Proceed To Delete',
        handler: () => {
          //console.log("confimr",evd);
          this.evidencedelete(evd);          //this.formSubmit(null);
        }
      }
    ]
  });
  alert.present();
}

evidencedelete(ev){

  this.apiService.callapi(this.apiService.APIS.EVIDENCE_DELETE,ev).subscribe(res=>{
    //console.log(res);
    this.listEvidancefile();
   this.helperService.presentToast("info","Evidence File deleted Successfully");
   //this.validStatement = true;
   ///this.filter();
  },
  (err) => {
   this.loading = false;
 }
  );

}

async send_notification(){
  const actionSheet = await this.actionSheetController.create({
    header: 'Reminder',
    cssClass: 'my-custom-class',
    buttons: [{
      text: 'Payment Reminder 1',
      role: 'destructive',
      icon: 'share',
      id: 'delete-button',
      handler: () => {
        this.send_api_notification('Payment_reminder_1');
      }
    }, {
      text: 'Payment Reminder 2',
      icon: 'share',
      handler: () => {
        this.send_api_notification('Payment_reminder_2');
      }
    }, {
      text: 'Payment Reminder 3',
      icon: 'share',
      handler: () => {
        this.send_api_notification('Payment_reminder_3');
      }
    },{
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        return false;
      }
    }]
  });
  await actionSheet.present();

//   const { role, data } = await actionSheet.onDidDismiss();
//   //console.log('onDidDismiss resolved with role and data', role, data);
//   if(role!='cancel'){
//   var rem=  await this.apiService.callapi(this.apiService.APIS.NOTIFICATION_ADDEDIT,data).toPromise();
//   if(rem){
//     this.helperService.presentToast("Info","Reminder Sent Successfully");
//     return 0;
//   }
// }
}



async send_api_notification(action='payment_reminder_1'){
  let data:any ={};
  data.quotation=this.model._id;
  data.action=action;;
  this.apiService.callapi(this.apiService.APIS.NOTIFICATION_ADDEDIT,data).subscribe(res=>{
    this.helperService.presentToast("Info","Reminder Sent Successfully");
  });
}

date_diff(date_1, date_2) {
  //console.log(date_1 + '' + date_2);
  const date1 = new Date(date_1);
  const date2 = new Date(date_2);
  const time = date2.getTime() - date1.getTime();
  const diffDays = Math.round(time / (1000 * 3600 * 24)); //Diference in Day

  return (diffDays+1);

}


calculateRemaining() {
  var ts = 0;
  //console.log(this.log_transactions);

  for (let i in this.log_transactions) {
   // t = t + parseInt(this.log_transactions[i].amount);
//console.log(this.log_transactions[i].amount);
    if (this.log_transactions[i].status == 'success') {
      ts = ts + parseFloat(this.log_transactions[i].amount);
    }

  }

var rs= ts - this.model.total;
//console.log(rs);

  this.remainingPayment = this.helperService.TrimNumberToDecimals(this.model.total - ts);
  if(rs > 0){
    this.remainingPayment=0;

    this.remainingPaymentSurplus=this.helperService.TrimNumberToDecimals(rs);
  }

}


}

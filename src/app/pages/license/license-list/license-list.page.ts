import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services';
import { ModalController,ActionSheetController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-license-list',
  templateUrl: './license-list.page.html',
  styleUrls: ['./license-list.page.scss'],
})
export class LicenseListPage implements OnInit {

  filtermodel: any = {};
  items: any;
  temprows: any = [];
  loading = false;
  model:any ={};
  
  licensestatus:any=[{'ids':'All','name':'all'},{'ids':'Active','name':'active'},{'ids':'Expired','name':'expired'},{'ids':'Expiring Within 10 Days','name':10},{'ids':'Expiring Within 30 Days','name':30},{'ids':'Expiring Within 60 Days','name':60},{'ids':'Expiring Within 90 Days','name':90}];

  pagination = {
    limit: 20,
    page: 1,
    count: 0,
    offset :0
 };

  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public router: Router,
    public authService: AuthService

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.getList();
  }

  filter(){
    this.pagination.page=1;
    this.getList();
  }
  getCustomer(s=null){
    if(s != null){
      this.filtermodel.searchqcustomer =s._id;
    } else {
      this.filtermodel.searchqcustomer =null;
    }
     this.pagination.page=1;
     this.getList();
   }

  //getList
  getList() {
    this.loading = true;
    let params: any = {...this.filtermodel};
    params.page = this.pagination.offset + 1;
    params.limit = this.pagination.limit;
    this.apiService.callapi(this.apiService.APIS.LICENSES_LIST, params).subscribe(
      (res) => {
        this.items = res.data;
        this.pagination.count =res.count;
        //console.log(res);
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.pagination.offset = pageInfo.offset;
    this.getList();
  }


  async send_notification(row){
    //console.log(row);
    const actionSheet = await this.actionSheetController.create({
      header: 'Reminder',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Renewal Reminder 1',
        role: 'destructive',
        icon: 'share',
        id: 'delete-button',
        handler: () => {
          this.send_api_notification(row,'Renewal_reminder');
        }
      }, {
        text: 'Renewal Reminder 2',
        icon: 'share',
        handler: () => {
          this.send_api_notification(row,'Renewal_reminder');
        }
      }, {
        text: 'Renewal Reminder 3',
        icon: 'share',
        handler: () => {
          this.send_api_notification(row,'Renewal_reminder');
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


  }


  async send_api_notification(row,action='payment_reminder_1'){
    let data:any ={};
    data.quotation=row.quotation;
    data.action=action;
    this.apiService.callapi(this.apiService.APIS.NOTIFICATION_ADDEDIT,data).subscribe(res=>{
      this.helperService.presentToast("Info","Reminder Sent Successfully");
    });
  }

  async renewal_pi(rows){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure,\n you want to Renew the PI?',
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
            this.router.navigate(['/quotation/addedit'], { queryParams: { _id:rows.quotation._id, action:'piRenewal' } });
          },
        },
      ],
    });

    await alert.present();

    // console.log(rows);
    // var parm :any={};
    // parm.quotation=rows?.quotation?._id;

    // console.log(parm);
    // this.apiService.callapi(this.apiService.APIS.RENEWAL_ADDEDIT,parm).subscribe(res=>{
    //   console.log(res);
    //   this.getList();
    //   this.helperService.presentToast("Info","Renewal PI seq "+ res?.data?.idseq+" Successfully");
    // });

  }

}

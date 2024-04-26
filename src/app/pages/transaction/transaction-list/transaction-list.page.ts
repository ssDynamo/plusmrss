import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { TransactionAddeditPage } from '../transaction-addedit/transaction-addedit.page';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.page.html',
  styleUrls: ['./transaction-list.page.scss'],
})
export class TransactionListPage implements OnInit {


  filtermodel: any = {};
  items: any;
  temprows: any = [];
  loading = false;

  pagination = {
    limit: 10,
    page: 0,
    count: 0,
    offset : 0
  };

  constructor(
    private apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController,
    public authService: AuthService

  ) {}

  ngOnInit() {
    if(this.authService.checkPermission('transaction_list') == false){
      return 0;
    }
    this.getList();
  }

  filter(){
    this.pagination.page=1;
    this.getList();
  }

  //getList
  getList() {
    this.loading = true;
    let params: any = {...this.filtermodel};
    params.page = this.pagination.offset + 1;
    params.limit = this.pagination.limit;



    this.apiService.callapi(this.apiService.APIS.TRANSACTION_LIST, params).subscribe(
      (res) => {
        this.items = res.data;
        this.pagination.count = res.count;
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

  async presentAddeditModal(item:any= null) {
    const modal = await this.modalController.create({
      component: TransactionAddeditPage,
      cssClass: 'request-addedit-page',
      componentProps: {
        item: item,
      },
    });

    modal.onDidDismiss().then((res:any) => {
      //const user = data['data']; // Here's your selected user!

      if(res.data?.refresh){
      this.getList();
      }

     });


    return await modal.present();
  }

  runReconcillation(){
    this.helperService.presentToast("info","Running Reconcillation","Please Wait");
    this.apiService.callapi(this.apiService.APIS.TRANSACTION_RECONCILLATION).subscribe(res=>{
      this.helperService.presentToast("info","Reconcillation Completed",res.data.count+' Transactions Updated');
      this.filter();

    })
  }

}



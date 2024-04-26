import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { AuthService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { CustomerAddeditPage } from '../customer-addedit/customer-addedit.page';
import { BulkUploadCustomerComponent } from '../bulk-upload-customer/bulk-upload-customer.component';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
})
export class CustomerListPage implements OnInit {

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
    this.getList();
  }

  filter(){
    //console.log(this.filtermodel);
    this.pagination.page=1;
    this.pagination.offset=0;
    this.getList();
  }

  //getList
  getList() {
    this.loading = true;
    let params: any = {...this.filtermodel};
    params.page = this.pagination.offset + 1;
    params.limit = this.pagination.limit;



    this.apiService.callapi(this.apiService.APIS.CUSTOMER_LIST, params).subscribe(
      (res) => {
        this.items = res.data;
        this.pagination.count = res.count;
        //console.log(res);
        params = {};
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
      component: CustomerAddeditPage,
      cssClass: 'user-addedit-page',
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

  async presentBulkUpload(item:any= null) {
    const modal = await this.modalController.create({
      component: BulkUploadCustomerComponent,
      cssClass: 'user-addedit-page',
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

}

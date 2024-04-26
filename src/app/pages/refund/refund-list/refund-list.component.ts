import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { RefundAddeditComponent } from '../refund-addedit/refund-addedit.component';
import { AuthService } from '../../../services';

@Component({
  selector: 'app-refund-list',
  templateUrl: './refund-list.component.html',
  styleUrls: ['./refund-list.component.scss'],
})
export class RefundListComponent implements OnInit {
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
    this.pagination.page=1;
    this.getList();
  }

  //getList
  getList() {
    this.loading = true;
    let params: any = {...this.filtermodel};
    params.page = this.pagination.offset + 1;
    params.limit = this.pagination.limit;



    this.apiService.callapi(this.apiService.APIS.REFUND_LIST, params).subscribe(
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

 async presentRefundAddEdit(item:any= null){
    const modal = await this.modalController.create({
      component: RefundAddeditComponent,
      cssClass: 'transaction-addedit-page',
      componentProps: {
         item: item,
      },
    });

    modal.onDidDismiss().then((res:any) => {
     //const user = data['data']; // Here's your selected user!

     if(res.data?.refresh){
    }

    });


    return await modal.present();
  }

}

import { Component, OnInit } from '@angular/core';

import { ApiService, HelperService,AuthService } from '../../../services';

import { ModalController } from '@ionic/angular';

import { RequestAddeditPage } from '../../request/request-addedit/request-addedit.page';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
})
export class RequestListPage implements OnInit {

  currentUser: any;
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
  request: any;


  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
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


    this.apiService.callapi(this.apiService.APIS.REQUEST_LIST, params).subscribe(
      (res) => {
        this.items = res.data;
        this.request =this.items.filter(a => a.quotation !== null);
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

  async presentAddeditModal(item:any= null) {
    const modal = await this.modalController.create({
      component: RequestAddeditPage,
      cssClass: 'request-addedit-page',
      componentProps: {
        item: this.helperService.cloneWR(item),
        quotation_cart_index: item.quotation_cart_index
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

import { Component, OnInit } from '@angular/core';

import { ApiService, HelperService } from '../../services';

import { ModalController } from '@ionic/angular';
import { LogViewPage } from './log-view/log-view.page';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {

  
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
    public modalController: ModalController
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


    this.apiService.callapi(this.apiService.APIS.LOG_LIST, params).subscribe(
      (res) => {
        this.items = res.data;
        this.request =this.items.filter(a => a.quotation !== null);
        this.pagination.count =this.request.length;
        console.log(res);
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
      component: LogViewPage,
      cssClass: 'log-view-page',
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

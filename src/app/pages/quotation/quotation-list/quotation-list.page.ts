import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { AuthService } from '../../../services';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.page.html',
  styleUrls: ['./quotation-list.page.scss'],
})
export class QuotationListPage implements OnInit {
  filtermodel: any = {};
  items: any;
  temprows: any = [];
  loading = false;
  model:any ={};


  pagination = {
    limit: 7,
    page: 1,
    count: 0,
    offset :0
 };

  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController,
    public authService: AuthService

  ) {}

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



    this.apiService.callapi(this.apiService.APIS.QUOTATION_LIST, params).subscribe(
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


}

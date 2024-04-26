import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-creditnote-list',
  templateUrl: './creditnote-list.page.html',
  styleUrls: ['./creditnote-list.page.scss'],
})
export class CreditnoteListPage implements OnInit {
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

  constructor
  (
    private apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController
  ) { }

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



    this.apiService.callapi(this.apiService.APIS.CREDIT_LIST, params).subscribe(
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

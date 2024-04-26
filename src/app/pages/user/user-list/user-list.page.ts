import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { AuthService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { UserAddeditPage } from '../user-addedit/user-addedit.page';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  filtermodel: any = {};
  items: any;
  temprows: any = [];
  loading = false;

  pagination = {
    limit: 7,
    page: 1,
    count: 0,
    offset :0
 };

  constructor(
    private apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController,
    public authService: AuthService

  ) {}

  ngOnInit() {
    if(this.authService.checkPermission('user_list') == false){
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



    this.apiService.callapi(this.apiService.APIS.USER_LIST, params).subscribe(
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
      component: UserAddeditPage,
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

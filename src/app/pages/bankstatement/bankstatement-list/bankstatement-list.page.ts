import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../services';


@Component({
  selector: 'app-bankstatement-list',
  templateUrl: './bankstatement-list.page.html',
  styleUrls: ['./bankstatement-list.page.scss'],
})
export class BankstatementListPage implements OnInit {


  filtermodel: any = {};
  items: any;
  temprows: any = [];
  fileName: any;
  loading = false;
  validStatement= false;
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



    this.apiService.callapi(this.apiService.APIS.BANKSTATEMENT_LIST, params).subscribe(
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

  handleFileInput($event){
    let files=$event.target?.files;
    this.helperService.presentToast("info","Uploading File");
    this.fileName = files[0].name;
    const ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
    //console.log(ext);
    // const file = this.fileName.slice(0, this.fileName.lastIndexOf('.'));
    // console.log(file);
    if(ext == 'xlsx' || ext == 'xls' ){
      this.apiService.uploadFile(files[0])
      .subscribe(res => {
         //console.log(res);
         this.helperService.presentToast("info","File Uploaded, Processing Records");
          this.runimport(res?.data);
      });
    } else {
      this.helperService.presentToast("error","Please Upload Only Excel File");
    }
  }



  runimport(file){
     this.apiService.callapi(this.apiService.APIS.BANKSTATEMENT_IMPORTFROMFILEPATH,file).subscribe(res=>{
      this.helperService.presentToast("info","Bank Statement imported Successfully");
      this.validStatement = true;
      this.filter();
     },
     (err) => {
      this.loading = false;
    }
     );
  }
}

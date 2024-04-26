import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from '../../../services';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-bulk-upload-customer',
  templateUrl: './bulk-upload-customer.component.html',
  styleUrls: ['./bulk-upload-customer.component.scss'],
})
export class BulkUploadCustomerComponent implements OnInit {
  filtermodel: any = {};
  items: any;
  temprows: any = [];
  fileName: any;
  loading = false;
  bulkuploadfile: any;
  validStatement= false;
  pagination = {
    limit: 10,
    page: 0,
    count: 0,
    offset : 0
  };


  constructor( private apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController) { }

  ngOnInit() {
    this.bulkuploadfile = environment.apiUrl+'/uploads/sample_bulk_Customerdata.xlsx';

  }

  // filter(){
  //   this.pagination.page=1;
  //   this.getList();
  // }

  //getList
  // getList() {
  //   this.loading = true;
  //   let params: any = {...this.filtermodel};
  //   params.page = this.pagination.offset + 1;
  //   params.limit = this.pagination.limit;



  //   this.apiService.callapi(this.apiService.APIS.BANKSTATEMENT_LIST, params).subscribe(
  //     (res) => {
  //       this.items = res.data;
  //       this.pagination.count = res.count;
  //       console.log(res);
  //       this.loading = false;
  //     },
  //     (err) => {
  //       this.loading = false;
  //     }
  //   );
  // }

  // pageCallback(pageInfo: {
  //   count?: number;
  //   pageSize?: number;
  //   limit?: number;
  //   offset?: number;
  // }) {
  //   this.pagination.offset = pageInfo.offset;
  //   this.getList();
  // }

  handleFileInput($event){
    let files=$event.target.files;
    this.helperService.presentToast("info","Uploading File");
    this.fileName = files[0].name;
    const ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
    console.log(ext);
    // const file = this.fileName.slice(0, this.fileName.lastIndexOf('.'));
    // console.log(file);
    if(ext == 'xlsx' || ext == 'xls' ){
      this.apiService.uploadFile(files[0])
      .subscribe(res => {
         console.log(res);
         this.helperService.presentToast("info","File Uploaded, Processing Records");
          this.runimport(res?.data);
          this.dismiss(true);
      });
    } else {
      this.helperService.presentToast("error","Please Upload Only Excel File");
    }
  }



  runimport(file){
     this.apiService.callapi(this.apiService.APIS.BULK_UPLOAD,file).subscribe(res=>{
      this.helperService.presentToast("info","File Uploaded Successfully");
      this.dismiss(true);
      this.validStatement = true;
      //this.filter();

     },
     (err) => {
      this.loading = false;
    }
     );
  }

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }

}

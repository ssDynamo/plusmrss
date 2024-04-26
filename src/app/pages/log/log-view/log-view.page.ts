import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiService, HelperService, AuthService } from '../../../services';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.page.html',
  styleUrls: ['./log-view.page.scss'],
})
export class LogViewPage implements OnInit {
  @Input() item: any;
  filtermodel: any = {};
  items: any;
  temprows: any = [];
  loading = false;

  pagination = {
    limit: 100,
    page: 0,
    count: 0,
    offset : 0
  };
  request: any;
  docspecs:any={};
  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.filtermodel.quotation=this.item._id;
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

  dismiss(refresh=false) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      'refresh':refresh
    });
  }

  html2PDF(download=false, item)
  {
 
    // parentdiv is the html element which has to be converted to PDF
    html2canvas(document.querySelector("#print-section")).then(canvas => {
    console.log(canvas.width ,canvas.height);
    // canvas.width =210;
    // canvas.height=297;

    const imgWidth = 200; 
    const pageHeight = 285;  
    const imgHeight = (canvas.height) * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    //var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    //const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      console.log(imgHeight);
    let position = 0;
   
    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, position, imgWidth, 300);
   
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        //pdf.addPage();
        //pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, position, imgWidth,200);
        heightLeft -= pageHeight;
      }


      pdf.save(item?.action+'.pdf');

  });

}
}

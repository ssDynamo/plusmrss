import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';


import { HelperService,ApiService } from '../../../services';

import { jsPDF } from "jspdf";

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-license-view',
  templateUrl: './license-view.page.html',
  styleUrls: ['./license-view.page.scss'],
})
export class LicenseViewPage implements OnInit {

  item:any;
  loading=false;
  pageurl:any='mrss';
  elementType:any = 'url';
  cartitem_seq=0;
  showembedpdf=false;
  slightnoidea=false;
  embedstring:any;
  log_creditnotes: any=[];
  constructor(public activatedRoute:ActivatedRoute,public helperService:HelperService,public apiService:ApiService,public sanitizer: DomSanitizer) { }
  docspecs:any={};
  ngOnInit() {
  }
  ionViewDidEnter() {




    this.setItem();
  }



  async setItem(){
    let _id = this.activatedRoute.snapshot.queryParams['_id'];
    this.cartitem_seq = Number(this.activatedRoute.snapshot.queryParams['cartitem_seq']);
    this.pageurl=document.URL;

    if (_id) {
      this.loading=true;
      let state: any = window.history.state;
      //console.log('state', state);
      if(state?.item?._id){
      this.item = this.helperService.cloneWR(state.item);

      }
      else {
        await this.getSetItemById(_id);
      }
      
      this.loading=false;
      //console.log(this.item);
      //if (typeof this.model.customer != 'string' && this.model.customer) { this.model.customer=this.model.customer._id; }
      //if (typeof this.model.user != 'string' && this.model.user) { this.model.user=this.model.user._id; }
      //}
    }
    await this.listCreditNote(_id);
    let view = this.activatedRoute.snapshot.queryParams['view'];
    switch(view){


      default:
        this.docspecs.title="Licence";
        this.docspecs.title_no=_id+':'+this.cartitem_seq;
        break;
    }

  }

  async getSetItemById(_id){

  let r = await this.apiService.callapi(this.apiService.APIS.PUBLIC_QUOTATION_LIST,{_id:_id}).toPromise();
  //console.log('item fetched');
  this.item=r.data[0];
  }


  listCreditNote(_id){
   
      this.apiService.callapi(this.apiService.APIS.CREDIT_LIST,{quotation:_id}).subscribe(res=>{
        this.log_creditnotes=res.data;
        //console.log(this.log_creditnotes.length);

      });
    
  }

  html2PDF(download=false)
  {
    this.showembedpdf=false;
    this.slightnoidea=false;
    // parentdiv is the html element which has to be converted to PDF
    html2canvas(document.querySelector("#print-section2"),{
      scale: 5,}).then(canvas => {

      var pdf = new jsPDF('p', 'px', 'a4');

      var imgData  = canvas.toDataURL("image/jpeg", 1.0);

      var width = pdf.internal.pageSize.width;


      var wid = canvas.width; var hgt = canvas.height;
      var hratio = hgt/wid;

      var height = width * hratio;


      pdf.addImage(imgData,0,0,width, height);

      if(download){
        pdf.save('License-'+new Date()+'.pdf');
      }else{
      let t=this.sanitizer.bypassSecurityTrustResourceUrl(pdf.output('datauristring'));
      this.embedstring=t;
      setTimeout(()=>{
        this.showembedpdf=true;
      },1000);


      setTimeout(()=>{
        this.slightnoidea=true;
      },1000);

      }
      //pdf.save('converteddoc.pdf');

  });

}


}

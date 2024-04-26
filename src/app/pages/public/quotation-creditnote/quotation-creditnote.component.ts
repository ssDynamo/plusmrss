import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { HelperService,ApiService } from '../../../services';
@Component({
  selector: 'app-quotation-creditnote',
  templateUrl: './quotation-creditnote.component.html',
  styleUrls: ['./quotation-creditnote.component.scss'],
})
export class QuotationCreditnoteComponent implements OnInit {
  docspecs: any;

  constructor(public activatedRoute:ActivatedRoute,public helperService:HelperService,public apiService:ApiService,public sanitizer: DomSanitizer) { }
  item:any;
  loading=false;
  showembedpdf=false;
  slightnoidea=false;
  ngOnInit() {
  this.docspecs="Credit Note";

  }
  ionViewDidEnter() {
    this.setItem();
  }
  async setItem(){
    let _id = this.activatedRoute.snapshot.queryParams['_id'];

    // this.pageurl=document.URL;

    if (_id) {
      this.loading=true;
      let state: any = window.history.state;
      console.log('state', state);
      if(state?.item?._id){
      this.item = this.helperService.cloneWR(state.item);
      console.log(this.item);
      }
      else {
        await this.getSetItemById(_id);
      }
      this.loading=false;
      console.log(this.item);
      //if (typeof this.model.customer != 'string' && this.model.customer) { this.model.customer=this.model.customer._id; }
      //if (typeof this.model.user != 'string' && this.model.user) { this.model.user=this.model.user._id; }
      //}
    }

  }
  async getSetItemById(_id){

    let r = await this.apiService.callapi(this.apiService.APIS.PUBLIC_CREDIT_LIST,{_id:_id}).toPromise();
    console.log('item fetched');
    this.item=r.data[0];
    }


  html2PDF(download=false)
  {
    this.showembedpdf=false;
    this.slightnoidea=false;
    // parentdiv is the html element which has to be converted to PDF
    html2canvas(document.querySelector("#print-section")).then(canvas => {
    console.log(canvas.width ,canvas.height);
    // canvas.width =210;
    // canvas.height=297;
    //var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
    var pdf = new jsPDF('p', 'mm', 'a4');

   // var imgData  = canvas.toDataURL("image/jpeg", 1.0);
   // pdf.addImage(imgData,0,0,canvas.width, canvas.height);
   pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, 210, 298);
   pdf.save(this.docspecs+' '+this.item.idseq+'.pdf');
  });

}

}

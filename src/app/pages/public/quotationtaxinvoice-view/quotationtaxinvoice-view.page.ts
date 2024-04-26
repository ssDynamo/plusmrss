import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperService, ApiService } from '../../../services';
import { environment } from '../../../../environments/environment';

import { jsPDF } from 'jspdf';

import html2canvas from 'html2canvas';

@Component({
  selector: 'app-quotationtaxinvoice-view',
  templateUrl: './quotationtaxinvoice-view.page.html',
  styleUrls: ['./quotationtaxinvoice-view.page.scss'],
})
export class QuotationtaxinvoiceViewPage implements OnInit {
  apiUrl: string = environment.apiUrl;
  item: any;
  loading = false;
  customer: any = {};
  showembedpdf = false;
  slightnoidea = false;
  embedstring: any;
  view: any;
  postdiv: any;
  ite: any;
  pagebreak = false;
  log_transactions: any;
  remainingPayment: number = 0;
  remainingPaymentSurplus: number;

  constructor(
    public activatedRoute: ActivatedRoute,
    public helperService: HelperService,
    public apiService: ApiService
  ) {}
  docspecs: any = {};
  ngOnInit() {
    this.view = this.activatedRoute.snapshot.queryParams['view'];
  }

  ionViewDidEnter() {
    switch (this.view) {
      case 'proformainvoice':
        this.docspecs.title = 'Proforma Invoice';
        this.docspecs.title_no = 'Proforma Invoice No.';
        this.docspecs.termsHTML =
          'As the above licence fee is inclusive of GST, we will proceed to issue both our tax invoice and the requisite licence upon receipt of the full licence fee from you.<br>We hope to receive the above-mentioned amount within 14 days from the date of this letter as stipulated in the Terms and Conditions of the application form. Please note that MRSS reserves the right to charge interest for late payment at the rate of 1% per month.';
        break;

      case 'taxinvoice':
        this.docspecs.title = 'Tax Invoice';
        this.docspecs.title_no = 'Tax Invoice No.';
        this.docspecs.termsHTML =
          'Please note that the requisite licence(s) can only be issued once the payment has been received.';
        break;
    }

    this.setItem();
  }

  async setItem() {
    let _id = this.activatedRoute.snapshot.queryParams['_id'];
    if (_id) {
      this.loading = true;
      let state: any = window.history.state;
      console.log('state', state);
      if (state?.item?._id) {
        this.item = this.helperService.cloneWR(state.item);
      } else {
        await this.getSetItemById(_id);
      }
      this.loading = false;

      //if (typeof this.model.customer != 'string' && this.model.customer) { this.model.customer=this.model.customer._id; }
      //if (typeof this.model.user != 'string' && this.model.user) { this.model.user=this.model.user._id; }
      //}
      
    }

    this.listTransactions();
  }

  async getSetItemById(_id) {
    let r = await this.apiService
      .callapi(this.apiService.APIS.PUBLIC_QUOTATION_LIST, { _id: _id })
      .toPromise();
    this.item = r.data[0];
    console.log(this.item?.items.length);
    if (this.item?.items.length > 2) {
      this.pagebreak = true;
    }
  }

  html2PDF(download = false) {
    this.showembedpdf = false;
    this.slightnoidea = false;
    // parentdiv is the html element which has to be converted to PDF

    console.log(document.querySelector('#print-section'));

    html2canvas(document.querySelector('#print-section')).then((canvas) => {
      console.log(canvas.width, canvas.height);
      console.log(canvas);
      // canvas.width =210;
      // canvas.height=297;
      var margin = 10;
      const imgWidth = 210 - margin * 2;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      console.log(imgWidth, imgHeight);
      //var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageSize = pdf.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      //const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      console.log(imgHeight);
      let position = 10;
      pdf.addImage(
        canvas.toDataURL('image/jpeg'),
        'JPEG',
        margin,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/jpeg'),
          'JPEG',
          margin,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      pdf.save(this.docspecs?.title + ' ' + this.item.idseq + '.pdf');
    });
  }

  listTransactions() {
    //if (this.item?.status == 'paid') {
      this.apiService
        .callapi(this.apiService.APIS.TRANSACTION_LIST, {
          quotation: this.item._id,
        })
        .subscribe((res) => {
          this.log_transactions = res.data;
          console.log(this.log_transactions, 'logtransaction');
          this.calculateRemaining();
        });
    //}
  }

  downloadpdf(download = false, action) {
    //   //console.log(document.getElementById("print-section"));
    // var html=document.getElementById("print-section").innerHTML;
    // console.log(html);
    // html= JSON.stringify(html);
    // console.log(html);

    var html = document.querySelector('#print-section').outerHTML;

    //   var parser = new DOMParser();
    // var doc = parser.parseFromString(html, "text/html")
    //   console.log(html);
    //var htmls= encodeURI(html);
    //let r = await this.apiService.callapi(this.apiService.APIS.DOWNLOAD_PDF,{view:html}).toPromise();
    // {view:this.view,_id:this.item._id}
    let r = this.apiService
      .callapi(this.apiService.APIS.DOWNLOAD_PDF, {
        viewhtml: html,
        view: this.view,
        _id: this.item._id,
        action:action,
        docspecs_title: this.docspecs.title,
      })
      .subscribe((res) => {
        console.log(res);
        if (res) {
          if(action !='emailsend'){
          var downloadurl = this.apiUrl + '/' + res.result['url'];
          window.open(downloadurl, '_blank');
          }
        }
      });
  }

  calculateRemaining() {
    var ts = 0;
    //console.log(this.log_transactions);
  
    for (let i in this.log_transactions) {
     // t = t + parseInt(this.log_transactions[i].amount);
  //console.log(this.log_transactions[i].amount);
      if (this.log_transactions[i].status == 'success') {
        ts = ts + parseFloat(this.log_transactions[i].amount);
      }
  
    }
  
  var rs= ts - this.item.total;
  //console.log(rs);
  
    this.remainingPayment = this.helperService.TrimNumberToDecimals(this.item.total - ts);
    if(rs > 0){
      this.remainingPayment=0;
  
      this.remainingPaymentSurplus=this.helperService.TrimNumberToDecimals(rs);
    }
  
  }
}

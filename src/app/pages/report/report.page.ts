import { Component, OnInit } from '@angular/core';
import { ApiService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services';
@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  model: any={};
  loading=false;
  myDate = new Date().toISOString();
  report:any =[];
  filtermodel: any = {};
  years: any = [];
  isValidDate: any;
  showCollectionReport=false;
  showDate =true;
  showStartEndDate = true;
  showRegion=false;
  showUser=false;
  showFilter=false;
  showTariffCat=false;
  showFilCollectionRep=false;
  is_generating: boolean = false;;
  constructor(
    public apiService: ApiService,
    public helperService: HelperService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.getReport();
    this. getYear();
  }

  getReport(){
    this.apiService.callapi(this.apiService.APIS.METADATA_CACHE_LIST).subscribe(res=>{
      this.report = res.data.report_type;
      //console.log(this.report);
      this.report =  this.report.sort((a, b) => a.name < b.name ? -1 : 1);
    });
  }

  formSubmit() {
    this.is_generating = true;
    this.isValidDate = this.validateDates(this.model.start_date, this.model.end_date);
    if (!this.isValidDate) {
      this.helperService.presentToast('warning', 'End date should be greater  than start date');
    }
    if(!this.model.alias){
      this.helperService.presentToast('warning', 'Please Select Report Type');
    }
    if (this.model && this.model.alias && this.isValidDate){
      this.apiService.callapi(this.apiService.APIS.REPORT_GENERATE, this.model).subscribe(res=>{
        window.open(this.apiService.apiUrl+''+res.file_url, '_self');
        this.helperService.presentToast('info','Report Generated Successfully');
        this.is_generating = false;
      },err=>{
        this.helperService.presentToast('error','Report Not Generated');
        this.is_generating = false;
      });

    }
  }


  filter(){
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      this.helperService.presentToast('warning', 'End date should be greater  than start date');
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  selectReport(value){
    if(value == 'collection_report'){
      this.showCollectionReport =true;
      this.showUser = false;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showRegion =false;
      this.showStartEndDate = false;
    } else if(value == 'outstanding_proforma_invoice_report'){
      this.showUser = true;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showStartEndDate = true;
    } else if(value ==  'overdue_aging_report'){
      this.showUser = true;
      this.showFilter = false;
      this.showTariffCat = true;
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showStartEndDate = true;
    } else if(value == 'enforcement_report'){
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showUser = false;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showStartEndDate = true;
    } else if(value == 'credit_note_refund_report'){
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showUser = false;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showStartEndDate = true;
    }else if(value == 'allcustomer'){
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showUser = false;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showStartEndDate = true;
      }
      else if(value == 'pi_aging_report'){
        this.showStartEndDate = false
      }
    else {
      this.showCollectionReport =false;
      this.showRegion =false;
      this.showUser = false;
      this.showFilter = false;
      this.showTariffCat = false;
      this.showStartEndDate = true;
    }
  }

  getYear()
    // {
    //  const currentYear: number = new Date().getFullYear();
    //  for(let i = (currentYear - 2); i < (currentYear + 7); i++) {
    //   this.years.push(i);
    // }
    {
      const currentYear: number = new Date().getFullYear();
     for(let i = (currentYear - 1); i <= (currentYear); i++) {
      this.years.push(i);
     }
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.page.html',
  styleUrls: ['./accounting.page.scss'],
})
export class AccountingPage implements OnInit {

  showpage="transactions";
  constructor(public authService: AuthService) { }

  ngOnInit() {
   if(this.authService.checkPermission('refund_list')){
      this.showpage = 'refunds';
    }
    if(this.authService.checkPermission('bankstatement_list')){
      this.showpage = 'bankstatement';
    }
    if(this.authService.checkPermission('creditenote_list')){
      this.showpage = 'creditnotes';
    }
    if(this.authService.checkPermission('transaction_list')){
      this.showpage = 'transactions';
    }
  }

  segmentChanged($event){
 //   console.log($event);
//    this.showpage=$event.detail.value;
console.log(this.showpage);
  }
}

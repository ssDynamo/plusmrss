import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  currentUser:any;

  public dataPages = [
    { title: 'Customers', url: '/customer', icon: 'people',alias:"customer_list" },
    { title: 'Metadata', url: '/metadata', icon: 'cloud-done',alias:"metadata_list" },
    { title: 'Reports', url: '/report', icon: 'briefcase',alias:"report_list" }
  ];

  public salesPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home',alias:"dashboard" },
    { title: 'Quotations', url: '/quotation/list', icon: 'archive',alias:"quotation_list" },
    { title: 'Licences', url: '/license', icon: 'newspaper',alias:"licenses_list" },
   // { title: 'Credit Notes', url: '/creditnote', icon: 'cart' },
   // { title: 'Receipts', url: '/transaction', icon: 'document-attach' },
  //  { title: 'Accounting', url: '/accounting', icon: 'newspaper',alias:"account_add" },
    { title: 'Requests', url: '/request', icon: 'git-pull-request',alias:"request_list" }
  ];



  // public adminPages = [
  //   { title: 'Users', url: '/user', icon: 'people-circle' },
  //   { title: 'Roles', url: '/role', icon: 'person' },
  //   { title: 'Tariffs', url: '/tariff', icon: 'grid' }
  // ];

  constructor(public authService: AuthService) { }

  ngOnInit() {

  }
  ionViewDidEnter(){
    this.currentUser=this.authService.currentUserValue;
    console.log(this.currentUser);
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  showpage="users";
  constructor( public authService: AuthService) { }

  ngOnInit() {
    if(this.authService.checkPermission('region_list')){
      this.showpage = 'regions';
    }
    if(this.authService.checkPermission('tariff_list')){
      this.showpage = 'tariffs';
    }
    if(this.authService.checkPermission('role_list')){
      this.showpage = 'roles';
    }
     if(this.authService.checkPermission('user_list')){
      this.showpage = 'users';
    }
  }

  segmentChanged($event){
 //   console.log($event);
//    this.showpage=$event.detail.value;
console.log(this.showpage);
  }
}

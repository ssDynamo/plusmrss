import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';

import { UserListPage } from './user-list/user-list.page';
import { UserAddeditPage } from './user-addedit/user-addedit.page';
 
 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    UserRoutingModule 
  ],
  declarations: [UserListPage,UserAddeditPage] ,
  exports : [UserListPage,UserAddeditPage]
})
export class UserModule {}

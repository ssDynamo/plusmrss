import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';


import { RoleRoutingModule } from './role-routing.module';

import { RoleListPage } from './role-list/role-list.page';
import { RoleAddeditPage } from './role-addedit/role-addedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RoleRoutingModule
  ],
  declarations: [RoleListPage,RoleAddeditPage],
  exports: [RoleListPage,RoleAddeditPage]

})
export class RoleModule {}

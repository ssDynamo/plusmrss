import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';

import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { TariffModule } from '../tariff/tariff.module';
import { RegionModule } from '../region/region.module';

import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AdminPageRoutingModule,UserModule,RoleModule,TariffModule,RegionModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}

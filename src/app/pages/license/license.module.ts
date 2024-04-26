import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicenseRoutingModule } from './license-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { LicenseListPage } from './license-list/license-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LicenseRoutingModule
  ],
  declarations: [LicenseListPage]
})
export class LicenseModule {}

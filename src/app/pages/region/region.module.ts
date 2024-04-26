import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegionPageRoutingModule } from './region-routing.module';

import { RegionAddeditPage } from './region-addedit/region-addedit.page';
import { RegionListPage } from './region-list/region-list.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegionPageRoutingModule,
    SharedModule
  ],
  declarations: [RegionListPage,RegionAddeditPage],
  exports: [RegionListPage,RegionAddeditPage]
})
export class RegionModule {}

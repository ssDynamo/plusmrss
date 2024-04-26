import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';


import { TariffRoutingModule } from './tariff-routing.module';

import { TariffListPage } from './tariff-list/tariff-list.page';
import { TariffAddeditPage } from './tariff-addedit/tariff-addedit.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TariffRoutingModule 
  ],
  declarations: [TariffListPage,TariffAddeditPage],
  exports: [TariffListPage,TariffAddeditPage]
})
export class TariffModule {}

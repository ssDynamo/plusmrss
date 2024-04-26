import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankstatementRoutingModule } from './bankstatement-routing.module';

import { BankstatementListPage } from './bankstatement-list/bankstatement-list.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BankstatementRoutingModule
  ],
  declarations: [BankstatementListPage],
  exports: [BankstatementListPage]
})
export class BankstatementModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionRoutingModule } from './transaction-routing.module';

import { TransactionListPage } from './transaction-list/transaction-list.page';
import { TransactionAddeditPage } from './transaction-addedit/transaction-addedit.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TransactionRoutingModule
  ],
  declarations: [TransactionListPage,TransactionAddeditPage],
  exports: [TransactionListPage,TransactionAddeditPage]
})
export class TransactionModule {}

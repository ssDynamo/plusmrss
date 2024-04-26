import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountingPageRoutingModule } from './accounting-routing.module';

import { AccountingPage } from './accounting.page';

import { TransactionModule } from '../transaction/transaction.module';
import { BankstatementModule } from '../bankstatement/bankstatement.module';
import { CreditnoteModule } from '../creditnote/creditnote.module';
import { RefundModule } from '../refund/refund.module';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AccountingPageRoutingModule,TransactionModule,BankstatementModule,CreditnoteModule,RefundModule
  ],
  declarations: [AccountingPage]
})
export class AccountingPageModule {}

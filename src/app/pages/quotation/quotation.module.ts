import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuotationRoutingModule } from './quotation-routing.module';

import { QuotationListPage } from './quotation-list/quotation-list.page';
import { QuotationAddeditPage } from './quotation-addedit/quotation-addedit.page';
import { SharedModule } from '../../shared/shared.module';
import { QuotationCartitemAddeditPage } from './quotation-cartitem-addedit/quotation-cartitem-addedit.page';


import { TransactionModule } from '../transaction/transaction.module';
import { RequestModule } from '../request/request.module'; 
import { LogModule } from '../log/log.module';
import { QuotationCartitemBulkUploadPage } from './quotation-cartitem-bulkupload/quotation-cartitem-bulkupload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TransactionModule, 
    RequestModule,
    LogModule,
    QuotationRoutingModule
  ],
  declarations: [QuotationListPage,QuotationAddeditPage,QuotationCartitemAddeditPage, QuotationCartitemBulkUploadPage]
})
export class QuotationModule {}

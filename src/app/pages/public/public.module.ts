import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicRoutingModule } from './public-routing.module';

import { QuotationtaxinvoiceViewPage } from './quotationtaxinvoice-view/quotationtaxinvoice-view.page';
import { LicenseViewPage } from './license-view/license-view.page';

import { SharedModule } from '../../shared/shared.module';
import { QuotationCreditnoteComponent } from './quotation-creditnote/quotation-creditnote.component';
import { ReceiptComponent } from './receipt/receipt.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [QuotationtaxinvoiceViewPage,LicenseViewPage,QuotationCreditnoteComponent,ReceiptComponent],
  exports: [QuotationtaxinvoiceViewPage,LicenseViewPage,QuotationCreditnoteComponent,ReceiptComponent]

})
export class PublicModule {}

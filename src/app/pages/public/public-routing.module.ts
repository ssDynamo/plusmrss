import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationtaxinvoiceViewPage } from './quotationtaxinvoice-view/quotationtaxinvoice-view.page';
import { LicenseViewPage } from './license-view/license-view.page';
import { QuotationCreditnoteComponent } from './quotation-creditnote/quotation-creditnote.component';
import { ReceiptComponent } from './receipt/receipt.component';


const routes: Routes = [
  {
    path: 'quotationtaxinvoice-view',
    component: QuotationtaxinvoiceViewPage
  },
  {
    path: 'license-view',
    component: LicenseViewPage
  },
  {
    path: 'credit-note',
    component: QuotationCreditnoteComponent
  },
  {
    path: 'receipt',
    component: ReceiptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}

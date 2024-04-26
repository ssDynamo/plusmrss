import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationListPage } from './quotation-list/quotation-list.page';
import { QuotationAddeditPage } from './quotation-addedit/quotation-addedit.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/quotation/list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: QuotationListPage
  },
  {
    path: 'addedit',
    component: QuotationAddeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotationRoutingModule {}

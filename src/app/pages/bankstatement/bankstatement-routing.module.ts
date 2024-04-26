import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankstatementListPage } from './bankstatement-list/bankstatement-list.page';

const routes: Routes = [
  {
    path: '',
    component: BankstatementListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankstatementRoutingModule {}

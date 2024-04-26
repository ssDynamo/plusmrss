import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TariffListPage } from './tariff-list/tariff-list.page';
import { TariffAddeditPage } from './tariff-addedit/tariff-addedit.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: TariffListPage
  },
  {
    path: 'addedit',
    component: TariffAddeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TariffRoutingModule {}

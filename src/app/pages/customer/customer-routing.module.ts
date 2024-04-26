import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerListPage } from './customer-list/customer-list.page';
import { CustomerAddeditPage } from './customer-addedit/customer-addedit.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/customer/list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: CustomerListPage
  },
  {
    path: 'addedit',
    component: CustomerAddeditPage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicenseListPage } from './license-list/license-list.page';

const routes: Routes = [
  {
    path: '',
    component: LicenseListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicenseRoutingModule {}

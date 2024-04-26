import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegionAddeditPage } from './region-addedit/region-addedit.page';
import { RegionListPage } from './region-list/region-list.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: RegionListPage,
  },
  {
    path: 'addedit',
    component: RegionAddeditPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionPageRoutingModule {}

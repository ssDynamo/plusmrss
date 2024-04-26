import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetadataListPage } from './metadata-list/metadata-list.page';
import { MetadataAddeditPage } from './metadata-addedit/metadata-addedit.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: MetadataListPage
  },
  {
    path: 'addedit',
    component: MetadataAddeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetadataRoutingModule {}

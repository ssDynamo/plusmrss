import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleListPage } from './role-list/role-list.page';
import { RoleAddeditPage } from './role-addedit/role-addedit.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: RoleListPage
  },
  {
    path: 'addedit',
    component:RoleAddeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}

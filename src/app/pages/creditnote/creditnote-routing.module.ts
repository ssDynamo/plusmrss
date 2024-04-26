import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditnoteListPage } from './creditnote-list/creditnote-list.page';
import { CreditnoteAddeditComponent } from './creditnote-addedit/creditnote-addedit.component';

const routes: Routes = [
  {
    path: '',
    component: CreditnoteListPage
  },{
    path: 'addedit',
    component: CreditnoteAddeditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditnoteRoutingModule {}

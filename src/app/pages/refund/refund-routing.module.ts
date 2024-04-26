import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefundListComponent } from './refund-list/refund-list.component';

const routes: Routes = [
  {
    path: '',
    component: RefundListComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }

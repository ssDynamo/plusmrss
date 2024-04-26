
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';
import { RefundRoutingModule } from './refund-routing.module';
import { RefundListComponent } from './refund-list/refund-list.component';
import { RefundAddeditComponent } from './refund-addedit/refund-addedit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RefundRoutingModule
  ],
  declarations: [RefundListComponent,RefundAddeditComponent],
  exports: [RefundListComponent,RefundAddeditComponent]
})
export class RefundModule { }

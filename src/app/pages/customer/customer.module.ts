import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CustomerRoutingModule } from './customer-routing.module';

import { CustomerListPage } from './customer-list/customer-list.page';
import { CustomerAddeditPage } from './customer-addedit/customer-addedit.page';
import { BulkUploadCustomerComponent } from './bulk-upload-customer/bulk-upload-customer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CustomerRoutingModule
  ],
  declarations: [CustomerListPage,CustomerAddeditPage, BulkUploadCustomerComponent]
})
export class CustomerModule {}

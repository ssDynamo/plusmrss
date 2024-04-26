import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestRoutingModule } from './request-routing.module';

import { RequestListPage } from './request-list/request-list.page';
import { RequestAddeditPage } from './request-addedit/request-addedit.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RequestRoutingModule
  ],
  declarations: [RequestListPage,RequestAddeditPage]
})
export class RequestModule {}

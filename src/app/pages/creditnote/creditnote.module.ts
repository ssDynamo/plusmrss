import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CreditnoteRoutingModule } from './creditnote-routing.module';

import { CreditnoteListPage } from './creditnote-list/creditnote-list.page';
import { CreditnoteAddeditComponent } from './creditnote-addedit/creditnote-addedit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditnoteRoutingModule,
    SharedModule
  ],
  declarations: [CreditnoteListPage,CreditnoteAddeditComponent],
  exports: [CreditnoteListPage,CreditnoteAddeditComponent]

})
export class CreditnoteModule {}

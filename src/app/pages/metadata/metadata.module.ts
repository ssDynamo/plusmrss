import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { MetadataRoutingModule } from './metadata-routing.module';

import { MetadataListPage } from './metadata-list/metadata-list.page';
import { MetadataAddeditPage } from './metadata-addedit/metadata-addedit.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MetadataRoutingModule
  ],
  declarations: [MetadataListPage,MetadataAddeditPage]
})
export class MetadataModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { LoadingspinnerComponent } from './components/loadingspinner/loadingspinner.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {NgxPrintModule} from 'ngx-print';

import { NgJsonEditorModule,JsonEditorOptions } from '@maaxgr/ang-jsoneditor';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { AngularFileUploaderModule } from "angular-file-uploader";
import { CustomerAutocompleteComponent } from './components/customer-autocomplete/customer-autocomplete.component';
import { UserAutocompleteComponent } from './components/user-autocomplete/user-autocomplete.component'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    RouterModule, 
    NgSelectModule,
    NgxDatatableModule,
    NgJsonEditorModule,
    NgxPrintModule,
    NgxQRCodeModule,
    AngularFileUploaderModule
  ],
  declarations: [ 
    LoadingspinnerComponent,
    CustomerAutocompleteComponent,
    UserAutocompleteComponent
  ],
  exports: [
    FormsModule,
    IonicModule,
    CommonModule,
    NgSelectModule,
    NgxDatatableModule,
    LoadingspinnerComponent,
    NgJsonEditorModule, 
    NgxPrintModule,
    NgxQRCodeModule,
    AngularFileUploaderModule,
    CustomerAutocompleteComponent,
    UserAutocompleteComponent 
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';

import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

import { JsonEditorOptions, NgJsonEditorModule } from '@maaxgr/ang-jsoneditor' 


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './layouts/layout.module';
import { SharedModule } from './shared/shared.module';

import {
  AppEventsService,
  ApiService,
  HelperService,
  AuthService,
  AuthGuard, 
  TokenInterceptor,
  ErrorInterceptor,
} from './services/index'; 

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ mode: 'md' }),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '__k005mrssapp',
      driverOrder: [
        CordovaSQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    }),
    LayoutModule,
    SharedModule,
    NgJsonEditorModule 
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    JsonEditorOptions,
    AppEventsService,
    ApiService,
    HelperService,
    AuthService,
    AuthGuard,
    TokenInterceptor,
    ErrorInterceptor,
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

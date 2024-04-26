import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterModule} from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    NgChartsModule
    ],
  declarations: [HeaderComponent,SidebarComponent],
  exports:[HeaderComponent,SidebarComponent]
})
export class LayoutModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/index';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'quotation',
    loadChildren: () => import('./pages/quotation/quotation.module').then( m => m.QuotationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/customer.module').then( m => m.CustomerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'role',
    loadChildren: () => import('./pages/role/role.module').then( m => m.RoleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'metadata',
    loadChildren: () => import('./pages/metadata/metadata.module').then( m => m.MetadataModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tariff',
    loadChildren: () => import('./pages/tariff/tariff.module').then( m => m.TariffModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'license',
    loadChildren: () => import('./pages/license/license.module').then( m => m.LicenseModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'creditnote',
    loadChildren: () => import('./pages/creditnote/creditnote.module').then( m => m.CreditnoteModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'refund',
    loadChildren: () => import('./pages/refund/refund.module').then( m => m.RefundModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'request',
    loadChildren: () => import('./pages/request/request.module').then( m => m.RequestModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'transaction',
    loadChildren: () => import('./pages/transaction/transaction.module').then( m => m.TransactionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then( m => m.SupportPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounting',
    loadChildren: () => import('./pages/accounting/accounting.module').then( m => m.AccountingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'region',
    loadChildren: () => import('./pages/region/region.module').then( m => m.RegionModule),
    canActivate: [AuthGuard]
  },   {
    path: 'public',
    loadChildren: () => import('./pages/public/public.module').then( m => m.PublicModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationModule)
  }, 
  {
    path: 'log',
    loadChildren: () => import('./pages/log/log.module').then( m => m.LogModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

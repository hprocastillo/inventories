import {Routes} from '@angular/router';
import {NoAuthGuard} from './modules/auth/guards/no-auth.guard';
import {AuthGuard} from '@angular/fire/auth-guard';
import {PageNotFoundComponent} from './shared/component/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./shared/component/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCTS_ROUTES)
  },
  {
    path: 'stores',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/stores/products.routes').then(m => m.STORES_ROUTES),
  },
  {
    path: 'inventories',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/inventories/inventories.routes').then(m => m.INVENTORIES_ROUTES),
  },
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full',
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

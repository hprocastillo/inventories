import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {AuthGuard} from './modules/auth/guards/auth.guard';
import {NoAuthGuard} from './modules/auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./modules/auth/routes/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./shared/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
    path: '**', component: PageNotFoundComponent
  }
];

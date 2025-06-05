import {Routes} from '@angular/router';
import {ProductsListComponent} from './components/products-list/products-list.component';
import {ProductsNewComponent} from './components/products-new/products-new.component';
import {ProductsEditComponent} from './components/products-edit/products-edit.component';
import {ProductsViewComponent} from './components/products-view/products-view.component';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: ProductsListComponent
  },
  {
    path: 'new', component: ProductsNewComponent
  },
  {
    path: 'edit/:id', component: ProductsEditComponent
  },
  {
    path: 'view/:id', component: ProductsViewComponent
  }
];

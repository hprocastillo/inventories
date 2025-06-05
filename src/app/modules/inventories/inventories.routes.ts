import {Routes} from '@angular/router';
import {InventoriesListComponent} from './components/inventories-list/inventories-list.component';
import {InventoriesNewComponent} from './components/inventories-new/inventories-new.component';
import {InventoriesEditComponent} from './components/inventories-edit/inventories-edit.component';
import {InventoriesViewComponent} from './components/inventories-view/inventories-view.component';

export const INVENTORIES_ROUTES: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: InventoriesListComponent
  },
  {
    path: 'new', component: InventoriesNewComponent
  },
  {
    path: 'edit/:id', component: InventoriesEditComponent
  },
  {
    path: 'view/:id', component: InventoriesViewComponent
  }
];

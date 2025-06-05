import {Routes} from '@angular/router';
import {StoresListComponent} from './components/stores-list/stores-list.component';
import {StoresNewComponent} from './components/stores-new/stores-new.component';
import {StoresEditComponent} from './components/stores-edit/stores-edit.component';
import {StoresViewComponent} from './components/stores-view/stores-view.component';

export const STORES_ROUTES: Routes = [
  {
    path: '', redirectTo: 'list', pathMatch: 'full'
  },
  {
    path: 'list', component: StoresListComponent
  },
  {
    path: 'new', component: StoresNewComponent
  },
  {
    path: 'edit/:id', component: StoresEditComponent
  },
  {
    path: 'view/:id', component: StoresViewComponent
  }
];

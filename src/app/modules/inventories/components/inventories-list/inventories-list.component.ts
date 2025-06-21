import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {InventoriesNewComponent} from '../inventories-new/inventories-new.component';
import {InventoriesEditComponent} from '../inventories-edit/inventories-edit.component';

@Component({
  selector: 'app-inventories-list',
  imports: [
    InventoriesNewComponent,
    InventoriesEditComponent
  ],
  templateUrl: './inventories-list.component.html',
  styleUrl: './inventories-list.component.scss'
})
export class InventoriesListComponent {
  /** injects **/
  public router = inject(Router);

  /** variables **/
  public template: string = "NEW";
}

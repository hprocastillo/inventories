import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-inventories-list',
  imports: [
    RouterLink
  ],
  templateUrl: './inventories-list.component.html',
  styleUrl: './inventories-list.component.scss'
})
export class InventoriesListComponent {
  /** injects **/
  public router = inject(Router);
}

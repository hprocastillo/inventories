import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  /** injects **/
  public router = inject(Router);

  /** variables **/
  public listModules = [
    {name: "Productos", url: "/products/list", icon: "fa-solid fa-prescription-bottle-medical"},
    {name: "Inventarios", url: "/inventories/list", icon: "fa-solid fa-list-check"},
    {name: "Tiendas", url: "/stores/list", icon: "fa-solid fa-shop"},
  ];
}

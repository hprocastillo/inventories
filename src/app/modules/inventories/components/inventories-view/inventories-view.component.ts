import {Component, inject, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-inventories-view',
  imports: [],
  templateUrl: './inventories-view.component.html',
  styleUrl: './inventories-view.component.scss'
})
export class InventoriesViewComponent implements OnInit {
  /** injects **/
  public location = inject(Location);
  private activateRoute = inject(ActivatedRoute);

  /** variables **/
  public inventoryId: string | null = "";

  ngOnInit() {
    this.inventoryId = this.activateRoute.snapshot.paramMap.get('id');
    // O bien, para escuchar cambios:
    // this.route.paramMap.subscribe(params => {
    //   const userId = params.get('id');
    // });
  }
}

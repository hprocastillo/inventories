import {Component, EventEmitter, inject, OnInit, Output, signal} from '@angular/core';
import {StoresNewComponent} from '../stores-new/stores-new.component';
import {StoresEditComponent} from '../stores-edit/stores-edit.component';
import {Store} from '../../store';
import {StoresService} from '../../stores.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {UbigeoService} from '../../../../shared/services/ubigeo.service';

@Component({
  selector: 'app-stores-list',
  imports: [
    StoresNewComponent,
    StoresEditComponent,
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss'
})
export class StoresListComponent implements OnInit {
  /** IO **/
  @Output() edit = new EventEmitter<Store>();
  @Output() delete = new EventEmitter<string>();

  /** injects **/
  private storesService = inject(StoresService);
  private ubigeoService = inject(UbigeoService);

  /** variables **/
  public template = signal<'NEW' | 'EDIT'>('NEW');
  public storeToEdit: Store | null = null;
  public stores: Store[] = [];

  ngOnInit(): void {
    this.storesService.getStores().subscribe(stores => {
      // Por cada tienda, busca los nombres legibles
      this.stores = stores.map(store => ({
        ...store,
        stateName: this.ubigeoService.getDepartamentos().find(dep => dep.code === store.state)?.name || store.state,
        provinceName: this.ubigeoService.getProvincias(store.state)?.find(prov => prov.code === store.province)?.name || store.province,
        districtName: this.ubigeoService.getDistritos(store.province)?.find(dist => dist.code === store.district)?.name || store.district,
      }));
    });
  }

  onEdit(store: Store) {
    this.storeToEdit = store;
    this.template.set('EDIT');
  }

  onCancelEdit() {
    this.storeToEdit = null;
    this.template.set('NEW');
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }

  onSavedOrUpdated() {
    this.onCancelEdit(); // regresa a modo "nuevo"
  }
}

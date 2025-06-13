import {Component, EventEmitter, inject, Output} from '@angular/core';
import {StoresNewComponent} from '../stores-new/stores-new.component';
import {StoresEditComponent} from '../stores-edit/stores-edit.component';
import {Store} from '../../store';
import {Observable} from 'rxjs';
import {StoresService} from '../../stores.service';
import {AsyncPipe, DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-stores-list',
  imports: [
    StoresNewComponent,
    StoresEditComponent,
    NgForOf,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss'
})
export class StoresListComponent {
  /** IO **/
  @Output() edit = new EventEmitter<Store>();
  @Output() delete = new EventEmitter<string>();

  /** injects **/
  private storesService = inject(StoresService);

  /** variables **/
  public template: string = "NEW";
  public stores$: Observable<Store[]>;

  constructor() {
    this.stores$ = this.storesService.getStores();
  }

  onEdit(store: Store) {
    this.edit.emit(store);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }
}

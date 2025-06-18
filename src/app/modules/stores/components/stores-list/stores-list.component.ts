import {Component, inject, OnInit} from '@angular/core';
import {StoresNewComponent} from '../stores-new/stores-new.component';
import {StoresEditComponent} from '../stores-edit/stores-edit.component';
import {Store} from '../../store';
import {StoresService} from '../../stores.service';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {UbigeoService} from '../../../../shared/services/ubigeo.service';
import {UsersService} from '../../../auth/services/users.service';
import {combineLatest} from 'rxjs';
import {User} from '../../../auth/interfaces/user';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-stores-list',
  imports: [
    StoresNewComponent,
    StoresEditComponent,
    NgForOf,
    DatePipe,
    NgIf,
    NgbPagination,
    SlicePipe
  ],
  templateUrl: './stores-list.component.html',
  styleUrl: './stores-list.component.scss'
})
export class StoresListComponent implements OnInit {
  /** injects **/
  private storesService = inject(StoresService);
  private usersService = inject(UsersService);
  private ubigeoService = inject(UbigeoService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);

  /** variables **/
  public template: string = "NEW";
  public storeToEdit: Store = {} as Store;
  public stores: Store[] = [];
  public page: number = 1;
  public pageSize: number = 10;

  ngOnInit(): void {
    combineLatest([
      this.storesService.getStores(),
      this.usersService.getUsers()
    ]).subscribe(([stores, users]) => {
      this.stores = stores.map(store => {
        const createdByName = users.find((u: User) => u.uid === store.createdBy);
        const updatedByName = users.find((u: User) => u.uid === store.updatedBy);
        return {
          ...store,
          stateName: this.ubigeoService.getDepartamentos().find(dep => dep.code === store.state)?.name || store.state,
          provinceName: this.ubigeoService.getProvincias(store.state).find(prov => prov.code === store.province)?.name || store.province,
          districtName: this.ubigeoService.getDistritos(store.province).find(dist => dist.code === store.district)?.name || store.district,
          createdByName: createdByName?.displayName || store.createdBy,
          updatedByName: updatedByName?.displayName || store.updatedBy
        };
      });
    });
  }

  async openDeleteModal(content: any, id: string | undefined): Promise<void> {
    if (!id) {
      this.toastService.showError('El ID de la tienda no es válido.');
      return;
    }
    try {
      const modalRef = this.modalService.open(content, {backdrop: 'static'});
      const result = await modalRef.result;
      if (result === 'confirm') {
        await this.onDelete(id);
      }
    } catch (error) {
      console.log('Modal cerrado sin confirmación', error);
    }
  }

  async onDelete(id: string): Promise<void> {
    try {
      await this.storesService.deleteStore(id);
      this.toastService.showSuccess('Tienda eliminada con exito!');
    } catch (e) {
      this.toastService.showError(`Error al eliminar la tienda. ${e}`);
    }
  }

  onEdit(store: Store): void {
    this.storeToEdit = store;
    this.template = "EDIT";
  }

  getTemplate(template: string): void {
    this.template = template
  }
}

import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Store } from '../../store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UbigeoService } from '../../../../shared/services/ubigeo.service';
import { NgForOf } from '@angular/common';
import { StoresService } from '../../stores.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-stores-edit',
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './stores-edit.component.html',
  styleUrl: './stores-edit.component.scss',
})
export class StoresEditComponent implements OnChanges {
  /** IO **/
  @Input() store!: Store;
  @Output() template = new EventEmitter<string>();

  /** injects **/
  private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);
  private storesService = inject(StoresService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);

  /** variables **/
  public editForm: FormGroup;
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];

  constructor() {
    this.editForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      state: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
    });

    // Opcional: carga departamentos desde el inicio (para selects)
    this.departamentos = this.ubigeoService.getDepartamentos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store'] && this.store) {
      this.editForm.patchValue({
        code: this.store.code,
        name: this.store.name,
        state: this.store.state,
        province: this.store.province,
        district: this.store.district,
      });

      // Precarga provincias y distritos para selects
      this.onDepartamentoChange(this.store.state, true);
      this.onProvinciaChange(this.store.province, true);
    }
  }

  onDepartamentoChange(depCode: string, precarga = false) {
    this.provincias = this.ubigeoService.getProvincias(depCode);
    this.editForm.get('province')?.reset();
    this.editForm.get('district')?.reset();
    if (precarga) {
      // No resetees si es precarga (desde ngOnChanges)
      this.editForm.get('province')?.setValue(this.store.province);
    }
  }

  onProvinciaChange(provCode: string, precarga = false) {
    this.distritos = this.ubigeoService.getDistritos(provCode);
    this.editForm.get('district')?.reset();
    if (precarga) {
      // No resetees si es precarga (desde ngOnChanges)
      this.editForm.get('district')?.setValue(this.store.district);
    }
  }

  toCancel(): void {
    this.template.emit('NEW');
  }

  async toEdit(): Promise<void> {
    if (this.editForm.valid) {
      const uid = this.auth.uid;
      const updateStore: Store = this.editForm.value;

      updateStore.name = updateStore.name.toUpperCase();
      updateStore.code = updateStore.code.toUpperCase();
      updateStore.updatedBy = uid ?? '';
      updateStore.updatedAt = Timestamp.now();

      try {
        await this.storesService.updateStore(this.store.id, updateStore);
        this.editForm.reset();
        this.editForm.get('province')?.disable();
        this.editForm.get('district')?.disable();
        this.toastService.showSuccess('Tienda actualizada con exito!');
        this.template.emit('NEW');
      } catch (e) {
        this.toastService.showError(`No se pudo editar la tienda, error: ${e}`);
        console.log(e);
      }
    } else {
      return;
    }
  }
}

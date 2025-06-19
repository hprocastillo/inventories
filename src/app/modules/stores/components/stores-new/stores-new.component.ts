import { Component, inject, OnInit } from '@angular/core';
import { UbigeoService } from '../../../../shared/services/ubigeo.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgForOf } from '@angular/common';
import { StoresService } from '../../stores.service';
import { Store } from '../../store';
import { AuthService } from '../../../auth/services/auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-stores-new',
  imports: [FormsModule, NgForOf, ReactiveFormsModule],
  standalone: true,
  templateUrl: './stores-new.component.html',
  styleUrl: './stores-new.component.scss',
})
export class StoresNewComponent implements OnInit {
  /** injects **/
  private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);
  private storesService = inject(StoresService);
  private auth = inject(AuthService);
  private toastService = inject(ToastService);

  /** varibles **/
  public departamentos: any[] = [];
  public provincias: any[] = [];
  public distritos: any[] = [];
  public newForm: FormGroup;

  constructor() {
    this.newForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      state: ['', Validators.required],
      province: [{ value: '', disabled: true }, Validators.required],
      district: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    this.departamentos = this.ubigeoService.getDepartamentos();

    this.newForm.get('state')?.valueChanges.subscribe((depCode) => {
      if (depCode) {
        this.provincias = this.ubigeoService.getProvincias(depCode) ?? [];
        this.newForm.get('province')?.enable();
      } else {
        this.provincias = [];
        this.newForm.get('province')?.disable();
      }
      this.newForm.get('province')?.reset('');
      this.newForm.get('district')?.reset('');
      this.distritos = [];
      this.newForm.get('district')?.disable();
    });

    this.newForm.get('province')?.valueChanges.subscribe((provCode) => {
      if (provCode) {
        this.distritos = this.ubigeoService.getDistritos(provCode) ?? [];
        this.newForm.get('district')?.enable();
      } else {
        this.distritos = [];
        this.newForm.get('district')?.disable();
      }
      this.newForm.get('district')?.reset('');
    });
  }

  async toSave(): Promise<void> {
    if (this.newForm.valid) {
      const uid = this.auth.uid;
      const newStore: Store = this.newForm.value;
      newStore.name = newStore.name.toUpperCase();
      newStore.code = newStore.code.toUpperCase();
      newStore.createdBy = uid ?? '';
      newStore.createdAt = Timestamp.now();
      newStore.updatedBy = uid ?? '';
      newStore.updatedAt = Timestamp.now();

      try {
        await this.storesService.createStore(newStore);
        this.newForm.reset();
        this.newForm.get('province')?.disable();
        this.newForm.get('district')?.disable();
        this.toastService.showSuccess('Tienda registrada con exito!');
      } catch (e) {
        this.toastService.showError(
          `No se pudo registrar la tienda, error: ${e}`
        );
        console.log(e);
      }
    } else {
      return;
    }
  }
}

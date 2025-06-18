import {Component, inject, OnInit} from '@angular/core';
import {UbigeoService} from '../../../../shared/services/ubigeo.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Timestamp} from '@angular/fire/firestore';
import {StoresService} from '../../stores.service';
import {Store} from '../../store';

@Component({
  selector: 'app-stores-new',
  imports: [FormsModule, NgForOf, ReactiveFormsModule],
  standalone: true,
  templateUrl: './stores-new.component.html',
  styleUrl: './stores-new.component.scss'
})
export class StoresNewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);
  private storesService = inject(StoresService);

  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];

  newForm: FormGroup;

  constructor() {
    this.newForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      state: ['', Validators.required],
      province: [{value: '', disabled: true}, Validators.required],
      district: [{value: '', disabled: true}, Validators.required],
    });
  }

  ngOnInit(): void {
    this.departamentos = this.ubigeoService.getDepartamentos();

    this.newForm.get('state')?.valueChanges.subscribe(depCode => {
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

    this.newForm.get('province')?.valueChanges.subscribe(provCode => {
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

  async saveStore() {
    if (this.newForm.invalid) return;

    let newStore: Store = this.newForm.value;
    newStore.createdAt = Timestamp.now();

    await this.storesService.createStore(newStore);

    // Puedes limpiar el formulario o mostrar mensaje de éxito
    this.newForm.reset();
    this.newForm.get('province')?.disable();
    this.newForm.get('district')?.disable();
    alert('Tienda registrada correctamente');
  }
}

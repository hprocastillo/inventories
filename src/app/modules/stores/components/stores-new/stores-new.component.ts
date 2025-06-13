import {Component, inject, OnInit} from '@angular/core';
import {UbigeoService} from '../../../../shared/services/ubigeo.service';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {StoresService} from '../../stores.service';
import {Timestamp} from '@angular/fire/firestore';

@Component({
  selector: 'app-stores-new',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './stores-new.component.html',
  styleUrl: './stores-new.component.scss'
})
export class StoresNewComponent implements OnInit {
  /** injects **/
  private ubigeoService = inject(UbigeoService);
  private storesService = inject(StoresService);
  private fb = inject(FormBuilder);

  /** variables **/
  public newForm: FormGroup;

  departamentos: any = [];
  provincias: any = [];
  distritos: any = [];
  departamentoSeleccionado: string | null = null;
  provinciaSeleccionada: string | null = null;
  distritoSeleccionado: string | null = null;

  constructor() {
    this.newForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      district: ['', Validators.required],
      province: ['', Validators.required],
      state: ['', Validators.required],
      createdBy: ['Herbert Pro'], // puedes obtenerlo de tu servicio de auth
      createdAt: [Timestamp.now()]
    });
  }

  ngOnInit(): void {
    this.departamentos = this.ubigeoService.getDepartamentos();
  }

  onDepartamentoChange(depCode: string) {
    this.provincias = this.ubigeoService.getProvincias(depCode);
    this.departamentoSeleccionado = depCode;
    this.provinciaSeleccionada = null;
    this.distritos = [];
    this.distritoSeleccionado = null;
  }

  onProvinciaChange(provCode: string) {
    this.distritos = this.ubigeoService.getDistritos(provCode);
    this.provinciaSeleccionada = provCode;
    this.distritoSeleccionado = null;
  }

  onDistritoChange(distCode: string) {
    this.distritoSeleccionado = distCode;
  }
}

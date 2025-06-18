import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Location, NgForOf } from '@angular/common';
import { StoresService } from '../../../stores/stores.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../../stores/store';
import * as XLSX from 'xlsx';
import { Detail_inventory, Inventory } from '../../inventory';
import {
  addDoc, collection, doc, Firestore, getCountFromServer, Timestamp, writeBatch
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventories-new',
  imports: [NgForOf, ReactiveFormsModule],
  standalone: true,
  templateUrl: './inventories-new.component.html',
  styleUrl: './inventories-new.component.scss'
})
export class InventoriesNewComponent implements OnInit, OnDestroy {
  public location = inject(Location);
  private storeService = inject(StoresService);
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);

  public stores: Store[] = [];
  public inventoryForm: FormGroup;
  public generatedCode = '';
  public previewProducts: Detail_inventory[] = [];
  public loadingExcel = false;

  private nextCorrelative = 1;
  private storesLoaded = false;
  private correlativeLoaded = false;
  private subs: Subscription[] = [];

  constructor() {
    this.inventoryForm = this.fb.group({
      store: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit INICIO');
    // 1. Traer tiendas
    const storesSub = this.storeService.getStores().subscribe(stores => {
      console.log('Tiendas recibidas del servicio:', stores);
      this.stores = stores;
      this.storesLoaded = true;
      this.logEstado();
      this.generateCodeIfReady();
    });
    this.subs.push(storesSub);

    // 2. Traer correlativo
    const inventoriesRef = collection(this.firestore, 'inventories');
    getCountFromServer(inventoriesRef).then(snapshot => {
      this.nextCorrelative = snapshot.data().count + 1;
      this.correlativeLoaded = true;
      console.log('Correlativo calculado:', this.nextCorrelative);
      this.logEstado();
      this.generateCodeIfReady();
    });

    // 3. Subscribe SOLO UNA VEZ
    const storeChangeSub = this.inventoryForm.get('store')?.valueChanges.subscribe((val) => {
      console.log('Seleccionaste tienda:', val);
      this.generateCodeIfReady();
    });
    if (storeChangeSub) this.subs.push(storeChangeSub);

    console.log('ngOnInit FIN');
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    console.log('Subscripciones limpiadas en ngOnDestroy');
  }

  private logEstado() {
    console.log('------ ESTADO ACTUAL ------');
    console.log('storesLoaded:', this.storesLoaded);
    console.log('correlativeLoaded:', this.correlativeLoaded);
    console.log('stores:', this.stores);
    console.log('nextCorrelative:', this.nextCorrelative);
    console.log('---------------------------');
  }

  private generateCodeIfReady() {
    const storeId = this.inventoryForm.get('store')?.value;
    console.log('[generateCodeIfReady] storeId:', storeId);

    if (!this.storesLoaded) {
      console.log('Aún NO storesLoaded');
      this.generatedCode = '';
      return;
    }
    if (!this.correlativeLoaded) {
      console.log('Aún NO correlativeLoaded');
      this.generatedCode = '';
      return;
    }
    if (!storeId) {
      console.log('Aún NO hay tienda seleccionada');
      this.generatedCode = '';
      return;
    }
    const store = this.stores.find(s => s.id === storeId);
    console.log('[generateCodeIfReady] store encontrado:', store);

    if (store && store.code) {
      // Aquí revisamos si el code ya tiene INV o no
      console.log('[generateCodeIfReady] store.code:', store.code);
      const prefix = 'INV';
      const storeCode = store.code;
      const number = this.nextCorrelative.toString().padStart(5, '0');
      this.generatedCode = `${prefix}-${storeCode}-${number}`;
      console.log('[generateCodeIfReady] Código generado:', this.generatedCode);
    } else {
      this.generatedCode = '';
      console.log('[generateCodeIfReady] No se pudo generar código.');
    }
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) return;
    this.loadingExcel = true;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      this.previewProducts = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0] && !row[1]) continue;
        this.previewProducts.push({
          id: '',
          product_barcode: String(row[0] || ''),
          product_code: String(row[1] || ''),
          product_description: String(row[2] || ''),
          product_laboratory: String(row[3] || ''),
          product_quantity: 0,
          product_fraction: 0,
          product_comments: '',
          created_by: '',
          created_at: Timestamp.now(),
          updated_by: '',
          updated_at: Timestamp.now()
        });
      }
      this.loadingExcel = false;
      console.log('Productos preview:', this.previewProducts);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async saveInventory() {
    if (this.inventoryForm.invalid || !this.generatedCode || this.previewProducts.length === 0) {
      console.log('No se puede guardar, formulario inválido o sin datos');
      return;
    }
    const storeId = this.inventoryForm.value.store;
    const inventoryRef = collection(this.firestore, 'inventories');
    const inventory: Omit<Inventory, 'id'> = {
      code: this.generatedCode,
      store_id: storeId,
      state: true,
      n_products: this.previewProducts.length,
      start_date: Timestamp.now(),
      end_date: null as any,
      created_by: 'usuario',
      created_at: Timestamp.now(),
      updated_by: 'usuario',
      updated_at: Timestamp.now()
    };
    console.log('Guardando inventario:', inventory);
    const docRef = await addDoc(inventoryRef, inventory);
    const batch = writeBatch(this.firestore);
    const detailsRef = collection(this.firestore, 'detail_inventory');
    this.previewProducts.forEach(prod => {
      const newDetailRef = doc(detailsRef);
      batch.set(newDetailRef, {
        ...prod,
        id: newDetailRef.id,
        inventory_id: docRef.id,
        created_by: 'usuario',
        created_at: Timestamp.now(),
        updated_by: 'usuario',
        updated_at: Timestamp.now()
      });
    });
    await batch.commit();
    alert('Inventario registrado correctamente');
  }
}

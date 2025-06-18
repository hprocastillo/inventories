import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, Timestamp, updateDoc} from '@angular/fire/firestore';
import {Store} from './store';
import {Observable} from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  /** injects **/
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  /** ************** **/
  /** get all stores **/
  getStores(): Observable<Store[]> {
    const ref = collection(this.firestore, 'stores');
    return collectionData(ref, {idField: 'id'}) as Observable<Store[]>;
  }

  /** ****************** **/
  /** create a new store **/
  createStore(store: Store) {
    const uid = this.auth.uid;
    const ref = collection(this.firestore, 'stores');

    store.createdBy = uid;
    store.createdAt = Timestamp.now();
    return addDoc(ref, store);
  }

  /** ************** **/
  /** update a store **/
  updateStore(id: string, store: Partial<Store>) {
    const storeDoc = doc(this.firestore, `stores/${id}`);
    return updateDoc(storeDoc, store);
  }

  /** ************** **/
  /** delete a store **/
  deleteStore(id: string) {
    const storeDoc = doc(this.firestore, `stores/${id}`);
    return deleteDoc(storeDoc);
  }
}

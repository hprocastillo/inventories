import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {Store} from './store';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  /** injects **/
  private firestore = inject(Firestore);


  /** ************** **/
  /** get all stores **/
  getStores(): Observable<Store[]> {
    const ref = collection(this.firestore, 'stores');
    return collectionData(ref, {idField: 'id'}).pipe(
      map((stores: any[]) =>
        stores.sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }

  /** ****************** **/
  /** create a new store **/
  createStore(store: Store) {
    const ref = collection(this.firestore, 'stores');
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

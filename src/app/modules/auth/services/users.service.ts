import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {collection, collectionData, Firestore} from '@angular/fire/firestore';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  /** injects **/
  private firestore = inject(Firestore);

  /** get all users from firestore **/
  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, {idField: 'uid'}) as Observable<User[]>;
  }
}

import { Injectable } from '@angular/core';
import {ubigeoINEI} from 'peru-utils';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  getDepartamentos() {
    return ubigeoINEI.getDepartments(); // [{ code, name }]
  }
  getProvincias(depCode: string) {
    return ubigeoINEI.getProvince(depCode); // [{ code, name }]
  }
  getDistritos(provCode: string) {
    return ubigeoINEI.getDistrict(provCode); // [{ code, name }]
  }
}

import {Injectable} from '@angular/core';
import {ubigeoINEI} from 'peru-utils';

export interface IUbigeo {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  getDepartamentos(): IUbigeo[] {
    return (ubigeoINEI.getDepartments() ?? []) as IUbigeo[];
  }

  getProvincias(depCode: string): IUbigeo[] {
    return (ubigeoINEI.getProvince(depCode) ?? []) as IUbigeo[];
  }

  getDistritos(provCode: string): IUbigeo[] {
    return (ubigeoINEI.getDistrict(provCode) ?? []) as IUbigeo[];
  }

}

import {Timestamp} from '@angular/fire/firestore';

export interface Store {
  id: string;
  code: string;
  name: string;
  district: string;
  province: string;
  state: string;

  districtName?: string;
  provinceName?: string;
  stateName?: string;

  createdBy: string;
  createdAt: Timestamp;
}

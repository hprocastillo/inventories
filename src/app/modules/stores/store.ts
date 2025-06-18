import {Timestamp} from '@angular/fire/firestore';

export interface Store {
  id: string;
  code: string;
  name: string;
  district: string;
  province: string;
  state: string;

  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string;
  updatedAt: Timestamp;

  //enriched fields for show information
  districtName?: string;
  provinceName?: string;
  stateName?: string;
  createdByName?: string;
  updatedByName?: string;
}

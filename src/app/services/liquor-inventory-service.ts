import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface LiquorInventory {
  id: number;
  skuCode: string;
  brandName: string;
  strengthVv: number;
  bottleSizeMl: number;
  mrpApproved: number;
  noOfCases: number;
  noOfBottles: number;
  totalBottles: number;
  batchNumber: string;
  monthOfMfg: string;
  barcode: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class LiquorInventoryService {

  // ✅ FIXED HERE
  private baseUrl = `${environment.apiUrl}/liquor-inventory`;

  constructor(private http: HttpClient) {}

  //  GET ALL
  getAll(): Observable<LiquorInventory[]> {
    return this.http.get<LiquorInventory[]>(`${this.baseUrl}/all`);
  }
  //  BULK IMPORT
  bulkImport(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/bulk-import`, formData);
  }

  //  ADD SINGLE PRODUCT
  addProduct(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, payload);
  }
}

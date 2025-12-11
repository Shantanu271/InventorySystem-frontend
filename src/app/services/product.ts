import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface ProductDto {
  id: number;
  skuCode: string;
  barcode: string | null;
  name: string;
  category: string | null;
  unitOfMeasure: string | null;
  mrp: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  active: boolean;
}



@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Used by cashier / POS APIs
private readonly adminBaseUrl = `${environment.apiUrl}/admin/products`;
private readonly baseUrl = `${environment.apiUrl}/products`;



  constructor(private http: HttpClient) {}

  // ---------------- EXISTING METHODS (POS) ----------------

  getByCode(code: string): Observable<ProductDto> {
    return this.http.get<ProductDto>(
      `${this.baseUrl}/code/${encodeURIComponent(code)}`
    );
  }

  search(query: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/search`, {
      params: { query },
    });
  }



    updateStock(
    id: number,
    payload: { currentStock: number; minStockLevel: number }
  ): Observable<ProductDto> {
    return this.http.patch<ProductDto>(`${this.baseUrl}/${id}/stock`, payload);
  }

  // ---------------- NEW METHODS FOR ADMIN DASHBOARD ----------------

  /** Load products for Admin grid (optional search). */
  getAllForAdmin(search?: string): Observable<ProductDto[]> {
    let params = new HttpParams();
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }
    return this.http.get<ProductDto[]>(this.adminBaseUrl, { params });
  }

  /** Create product from Admin "Add Product" form. */
  createForAdmin(body: Partial<ProductDto>): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.adminBaseUrl, body);
  }

  /** Update product from Admin "Edit Product" form. */
  updateForAdmin(id: number, body: Partial<ProductDto>): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.adminBaseUrl}/${id}`, body);
  }

  /** Toggle active / inactive from Admin grid button. */
  toggleActiveForAdmin(id: number): Observable<ProductDto> {
    return this.http.patch<ProductDto>(
      `${this.adminBaseUrl}/${id}/toggle-active`,
      {}
    );
  }
    getOneForAdmin(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.adminBaseUrl}/${id}`);
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly baseUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  // GET stock from liquor_inventory
  getStock(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // PATCH audit adjustment
  adjustStock(id: number, newStock: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/${id}/adjust`,
      { totalBottles: newStock }
    );
  }
}

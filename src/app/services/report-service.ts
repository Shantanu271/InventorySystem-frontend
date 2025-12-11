import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ProductReportRow {
  code: string;
  name: string;
  category: string;
  totalQtySold: number;
  totalRevenue: number;
  lastSoldOn: string;
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = "https://inventorysystem-backend-de9k.onrender.com/api/reports";
  constructor(private http: HttpClient) {}

  getProductHistory(): Observable<ProductReportRow[]> {
    return this.http.get<ProductReportRow[]>(`${this.api}/product-history`);
  }
}

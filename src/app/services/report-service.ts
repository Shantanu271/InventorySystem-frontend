import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

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
private api = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getProductHistory(): Observable<ProductReportRow[]> {
    return this.http.get<ProductReportRow[]>(`${this.api}/product-history`);
  }
}

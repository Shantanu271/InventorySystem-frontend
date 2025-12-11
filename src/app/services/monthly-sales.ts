import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MonthlyRow {
  month: string;
  bills: number;
  itemsSold: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class MonthlySales{
  private baseUrl = 'https://inventorysystem-backend-de9k.onrender.com/api/viewer/reports';

  constructor(private http: HttpClient) {}

  getMonthlyReport(year: number): Observable<MonthlyRow[]> {
    return this.http.get<MonthlyRow[]>(`${this.baseUrl}/monthly?year=${year}`);
  }
}

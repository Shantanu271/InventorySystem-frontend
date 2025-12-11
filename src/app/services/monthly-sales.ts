import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

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
 private baseUrl = `${environment.apiUrl}/viewer/reports`;


  constructor(private http: HttpClient) {}

  getMonthlyReport(year: number): Observable<MonthlyRow[]> {
    return this.http.get<MonthlyRow[]>(`${this.baseUrl}/monthly?year=${year}`);
  }
}

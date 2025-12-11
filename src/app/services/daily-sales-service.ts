import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DailySalesService {

  constructor(private http: HttpClient) {}

 getDailySales(date: string) {
   return this.http.get(`${environment.apiUrl}/sales/daily`, {
    params: { date },
    responseType: 'text'
  });
  }
}

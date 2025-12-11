import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailySalesService {

  constructor(private http: HttpClient) {}

 getDailySales(date: string) {
  return this.http.get(`https://inventorysystem-backend-de9k.onrender.com/api/sales/daily`, {
    params: { date },
    responseType: 'text'
  });
  }
}

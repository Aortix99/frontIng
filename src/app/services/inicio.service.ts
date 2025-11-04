import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InicioService {
  servidor = 'https://backing-iwik.onrender.com';
  constructor(private servicio: HttpClient) { }
  calculateZapata(model: any): Observable<any> {
    return this.servicio.post(`${this.servidor}/zapata-combinada`, { model });
  }

}

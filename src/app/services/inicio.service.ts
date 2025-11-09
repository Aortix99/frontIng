import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InicioService {
  servidor = 'http://backing-iwik.onrender.com/api';
  constructor(private servicio: HttpClient) { }
  calculateZapata(model: any): Observable<any> {
    return this.servicio.post(`${this.servidor}/zapata-combinada`, { model });
  }

}

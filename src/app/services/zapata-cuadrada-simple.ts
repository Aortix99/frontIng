import { Injectable } from '@angular/core';
import { Raza } from '../interface/raza'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class zapataCuadradaAislada {


  servidor = 'https://back-ing.vercel.app/api';
  constructor(private servicio: HttpClient) { }
  zapataCuadradaSimple(model: any): Observable<any> {
    return this.servicio.post(`${this.servidor}/zapata-cuadrada-aislada`, model);
  }
}

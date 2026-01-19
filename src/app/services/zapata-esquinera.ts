import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class zapataEsquineraService {


  servidor = environment.apiUrl;
  constructor(private servicio: HttpClient) { }
  zapataEsquinera(model: any): Observable<any> {
    return this.servicio.post(`${this.servidor}/zapata-esquinera`, model);
  }
}

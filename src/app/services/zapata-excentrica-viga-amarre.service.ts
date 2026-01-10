import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ZapataExcentricaVigaAmarreService {
  servidor = environment.apiUrl;

  constructor(private http: HttpClient) { }

  calculateZapata(model: any): Observable<any> {
    return this.http.post(`${this.servidor}/zapata-combinada-amarre`, { model });
  }
}

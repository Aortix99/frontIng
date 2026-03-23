import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MunicipioSismico {
  codMunicipio: number;
  municipio: string;
  departamento: string;
  aa: number;
}

export interface CatalogoMunicipiosResponse {
  municipios: MunicipioSismico[];
}

@Injectable({
  providedIn: 'root',
})
export class VigaTensorZapataAisladaService {
  private readonly base = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getMunicipios(): Observable<CatalogoMunicipiosResponse> {
    return this.http.get<CatalogoMunicipiosResponse>(
      `${this.base}/municipios-sismicos`,
    );
  }

  calculate(model: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${this.base}/viga-tensor-zapata-aislada`, {
      model,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  MunicipioSismico,
  VigaTensorZapataAisladaService,
} from '../services/viga-tensor-zapata-aislada.service';
import {
  VigaTensorCalculationData,
  VigaTensorZapataAisladaPDFTemplate,
} from './viga-tensor-zapata-aislada-pdf.template';

/** Mismas opciones que vgNroBarra en zapata-excentrica-viga-amarre */
export const OPCIONES_BARRA_VIGA = [
  { area: 0.71, Nomen: '3/8' },
  { area: 1.29, Nomen: '1/2' },
  { area: 1.99, Nomen: '5/8' },
  { area: 2.84, Nomen: '3/4' },
  { area: 3.87, Nomen: '7/8' },
  { area: 5.07, Nomen: '1' },
] as const;

@Component({
  selector: 'app-viga-tensor-zapata-aislada',
  templateUrl: './viga-tensor-zapata-aislada.component.html',
  styleUrls: ['./viga-tensor-zapata-aislada.component.css'],
})
export class VigaTensorZapataAisladaComponent implements OnInit {
  form!: FormGroup;
  municipios: MunicipioSismico[] = [];
  cargandoMunicipios = true;
  errorCatalogo: string | null = null;
  filtroMunicipio = '';
  /** Respuesta del API de cálculo */
  response: any = null;
  readonly opcionesBarra = OPCIONES_BARRA_VIGA;

  mostrarModal = false;
  tituloModal = 'Resultados del cálculo';
  tamanoModal: 'small' | 'medium' | 'large' = 'medium';

  preparePDFDataFn = (name: string) => this.preparePDFData(name);

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: VigaTensorZapataAisladaService,
    public readonly pdfTemplate: VigaTensorZapataAisladaPDFTemplate,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codMunicipio: [null as number | null, Validators.required],
      BarraViga: [OPCIONES_BARRA_VIGA[1], Validators.required],
      b: [0.25, [Validators.required, Validators.min(0.01)]],
      h: [0.4, [Validators.required, Validators.min(0.01)]],
      cargaMaxima: [50, [Validators.required, Validators.min(0.01)]],
      luzViga: [5, [Validators.required, Validators.min(0.01)]],
      fc: [21, [Validators.required, Validators.min(1)]],
      fy: [420, [Validators.required, Validators.min(1)]],
    });

    this.api.getMunicipios().subscribe({
      next: (data) => {
        this.municipios = data.municipios ?? [];
        this.municipios.sort((a, b) => {
          const d = a.departamento.localeCompare(b.departamento, 'es');
          return d === 0 ? a.municipio.localeCompare(b.municipio, 'es') : d;
        });
        this.cargandoMunicipios = false;
        if (
          this.municipios.length &&
          this.form.get('codMunicipio')?.value == null
        ) {
          this.form.patchValue({ codMunicipio: this.municipios[0].codMunicipio });
        }
      },
      error: () => {
        this.cargandoMunicipios = false;
        this.errorCatalogo =
          'No se pudo cargar el listado de municipios. Verifique la sesión y el servidor.';
        Swal.fire({
          icon: 'error',
          title: 'Catálogo',
          text: this.errorCatalogo,
        });
      },
    });
  }

  get municipiosFiltrados(): MunicipioSismico[] {
    const raw = this.filtroMunicipio.trim();
    if (!raw) {
      return this.municipios;
    }
    const tokens = raw
      .split(/\s+/)
      .map((x) => this.normalizarBusqueda(x))
      .filter((x) => x.length > 0);
    if (!tokens.length) {
      return this.municipios;
    }
    return this.municipios.filter((m) => {
      const hay = this.normalizarBusqueda(this.cadenaRelacionadaMunicipio(m));
      return tokens.every((tok) => this.tokenCoincideMunicipio(hay, tok, m));
    });
  }

  /** Minúsculas y sin tildes para que coincidan “bogota” y “bogotá”. */
  private normalizarBusqueda(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /** Incluye depto, municipio, código (varias formas), Aa y etiqueta completa. */
  private cadenaRelacionadaMunicipio(m: MunicipioSismico): string {
    const codStr = String(m.codMunicipio);
    const codPad5 = codStr.padStart(5, '0');
    const aa =
      m.aa != null && !Number.isNaN(Number(m.aa))
        ? `${m.aa} ${Number(m.aa).toFixed(6)}`
        : '';
    return [
      m.departamento,
      m.municipio,
      codStr,
      codPad5,
      aa,
      this.etiquetaMunicipio(m),
      `${m.departamento} ${m.municipio}`,
    ].join(' ');
  }

  /**
   * Cada palabra del filtro debe aparecer en algún dato relacionado (AND).
   * El código DANE admite solo dígitos y variantes con ceros (p. ej. 05001).
   */
  private tokenCoincideMunicipio(
    hayNormalizado: string,
    tok: string,
    m: MunicipioSismico,
  ): boolean {
    if (hayNormalizado.includes(tok)) {
      return true;
    }
    const soloDigitos = tok.replace(/\D/g, '');
    if (soloDigitos.length > 0) {
      const cod = String(m.codMunicipio);
      const codPad = cod.padStart(5, '0');
      if (cod.includes(soloDigitos) || codPad.includes(soloDigitos)) {
        return true;
      }
    }
    return false;
  }

  etiquetaMunicipio(m: MunicipioSismico): string {
    return `${m.departamento} — ${m.municipio} (${m.codMunicipio})`;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  /** Formato numérico para el modal (misma lógica que el PDF). */
  formatNum(value: unknown, decimals = 4): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '—';
    }
    return Number(value).toFixed(decimals);
  }

  /**
   * Mismo criterio que el PDF: el backend envía `paso12.resultado` como string (`.toFixed(2)` en Node).
   */
  get separacionEstribosTexto(): string {
    const raw = this.response?.paso12?.resultado;
    if (raw === null || raw === undefined || raw === '') {
      return '—';
    }
    const m = Number(raw);
    if (Number.isNaN(m)) {
      return '—';
    }
    return `E @ ${this.formatNum(m, 2)} m (${this.formatNum(m * 100, 0)} cm)`;
  }

  private preparePDFData(reportName: string): VigaTensorCalculationData {
    const v = this.form.getRawValue();
    const barra = v.BarraViga as { area: number; Nomen: string };
    const cod = v.codMunicipio as number | null;
    const m = cod != null ? this.municipios.find((x) => x.codMunicipio === cod) : undefined;
    return {
      input: {
        codMunicipio: cod != null ? Number(cod) : 0,
        municipioLabel: m ? this.etiquetaMunicipio(m) : (cod != null ? String(cod) : '—'),
        barraNomen: barra.Nomen,
        barraArea: barra.area,
        b: Number(v.b),
        h: Number(v.h),
        cargaMaxima: Number(v.cargaMaxima),
        luzViga: Number(v.luzViga),
        fc: Number(v.fc),
        fy: Number(v.fy),
      },
      response: this.response,
      metadata: { projectName: reportName, date: new Date() },
    };
  }

  calcular(): void {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Seleccione municipio y complete los campos numéricos.',
      });
      return;
    }

    const v = this.form.getRawValue();
    const barra = v.BarraViga as { area: number; Nomen: string };

    const model = {
      codMunicipio: Number(v.codMunicipio),
      BarraViga: barra.area,
      b: Number(v.b),
      h: Number(v.h),
      cargaMaxima: Number(v.cargaMaxima),
      luzViga: Number(v.luzViga),
      fc: Number(v.fc),
      fy: Number(v.fy),
    };

    this.api.calculate(model).subscribe({
      next: (res: unknown) => {
        const data = res as { error?: boolean; message?: string };
        this.response = res;
        if (data.error) {
          this.mostrarModal = false;
          Swal.fire({
            icon: 'info',
            title: 'Revisar diseño',
            text: data.message ?? 'No cumple con las comprobaciones.',
          });
        } else {
          this.tituloModal = 'Resultados del cálculo — Viga de amarre';
          this.mostrarModal = true;
        }
      },
      error: (err) => {
        const msg =
          err?.error?.message ??
          err?.message ??
          'Error al comunicarse con el servidor.';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      },
    });
  }
}

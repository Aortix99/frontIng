import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InicioService } from '../services/inicio.service';
import { Inicio } from '../interface/inicio';
import { Columna } from '../interface/columna';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Swal from 'sweetalert2';
import { ZapataCombinadaCalculationData, ZapataCuadradaPDFTemplate } from './zapata-combinada-pdf.template';
import { PDFGeneratorService } from '../services/pdf-generator-clean.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public chart: Chart | undefined;
  buscar = '';
  InicioV: Array<Inicio> = [];
  myForm!: FormGroup;
  columnaForm!: FormGroup;
  informations!: FormGroup;
  columnas: Columna[] = [];
  suelo: number = 0;
  fc: number = 0;
  longitude: number = 0;
  data: any;
  response: any;
  // Propiedades para la modal
  mostrarModal: boolean = false;
  tituloModal: string = 'Información del Sistema';
  tamanoModal: 'small' | 'medium' | 'large' = 'medium';

  constructor(private readonly pdfTemplate: ZapataCuadradaPDFTemplate, private readonly fb: FormBuilder, private readonly pdfGenerator: PDFGeneratorService, private readonly http: HttpClient, private readonly inicioS: InicioService) { }

  ngOnInit(): void {
    this.informations = this.fb.group({
      Fc: [210, [Validators.required, Validators.min(0)]],
      Fy: [4200, [Validators.required, Validators.min(0)]],
      Wc: [24, [Validators.required, Validators.min(0)]],
      Qa: [23.3, [Validators.required, Validators.min(0)]],
      Ds: [1.13, [Validators.required, Validators.min(0)]],
      Hz: [0.7, [Validators.required, Validators.min(0)]],
      Lz: [5, [Validators.required, Validators.min(0)]],
      PdExt: [46.05, [Validators.required, Validators.min(0)]],
      PlExt: [9.21, [Validators.required, Validators.min(0)]],
      CxExt: [0.3, [Validators.required, Validators.min(0)]],
      CyExt: [0.4, [Validators.required, Validators.min(0)]],
      PdInt: [85.52, [Validators.required, Validators.min(0)]],
      PlInt: [17.105, [Validators.required, Validators.min(0)]],
      CxInt: [0.4, [Validators.required, Validators.min(0)]],
      CyInt: [0.4, [Validators.required, Validators.min(0)]]
    });
    this.prepararDatosGrafico();
  }

  prepararDatosGrafico() {
    this.data = {
      labels: [1, 2, 3, 4, 5],
      datasets: [{
        label: 'Ventas',
        data: [12, 19, 3, 5, 2],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    }
  }

  crearGrafico() {
    if (this.chart) {
      this.chart.destroy();
    }


    setTimeout(() => {
      const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
      if (canvas) {
        this.chart = new Chart(canvas, {
          type: 'scatter',
          data: this.data,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Gráfica cortante'
              },
              legend: {
                display: true
              },
              datalabels: {
                display: true,
                color: 'black',
                font: {
                  weight: 'bold'
                },
                formatter: function (value: any) {
                  return `(${value.x}, ${value.y})`;
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Eje X'
                },
                grid: {
                  color: function (context) {
                    if (context.tick.value === 0) {
                      return '#000000';
                    }
                    return 'rgba(0, 0, 0, 0.1)';
                  },
                  lineWidth: function (context) {
                    if (context.tick.value === 0) {
                      return 3;
                    }
                    return 1;
                  }
                },
                ticks: {
                  callback: function (value) {
                    return value;
                  }
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Eje Y'
                },
                grid: {
                  color: function (context) {
                    if (context.tick.value === 0) {
                      return '#000000';
                    }
                    return 'rgba(0, 0, 0, 0.1)';
                  },
                  lineWidth: function (context) {
                    if (context.tick.value === 0) {
                      return 3;
                    }
                    return 1;
                  }
                },
                ticks: {
                  callback: function (value) {
                    return value;
                  }
                }
              }
            }
          }
        });
      }
    }, 100);
  }

  calculate() {
    // Convertir todos los valores a números antes de enviar
    const formData = { ...this.informations.value };
    for (const key of Object.keys(formData)) {
      formData[key] = Number(formData[key]);
    }

    this.inicioS.calculateZapata(formData).subscribe({
      next: (datos) => {
        this.response = datos;
        if (datos.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el cálculo',
            text: datos.message,
            footer: datos.details || '',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#dc3545'
          });
          return;
        }
        this.InicioV = datos.response;
        this.actualizarDatosGrafico(datos.responseGrafica);
        this.tituloModal = 'Resultados del Cálculo';
        this.tamanoModal = 'large';
        this.mostrarModal = true;

        this.crearGrafico();
      },
      error: (error) => {
        console.error('Error en la petición:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }


  actualizarDatosGrafico(resultados: any) {
    // Convertir los datos D,V a formato {x, y} para el scatter plot
    const puntosXY = resultados.D.map((x: number, index: number) => ({
      x: x,
      y: resultados.V[index]
    }));

    this.data = {
      datasets: [{
        label: 'Resultados de Cálculo',
        data: puntosXY,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        pointRadius: 6,
        pointHoverRadius: 8,
        showLine: true,
        tension: 0.1
      }]
    }
  }

  // Métodos para manejar la modal
  abrirModalEjemplo() {
    this.tituloModal = 'Reporte de la zapata combinada';
    this.tamanoModal = 'medium';
    this.mostrarModal = true;

    this.crearGrafico();
  }

  cerrarModal() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    this.mostrarModal = false;
  }

  private preparePDFData(reportName: string): ZapataCombinadaCalculationData {
    return {
      input: this.informations.value,
      response: this.response,
      metadata: {
        projectName: reportName,
        date: new Date(),
        location: 'Ubicación del Proyecto'
      },
      chartImage: this.getChartAsBase64(),
      chartPoints: this.data?.datasets?.[0]?.data || []
    };
  }

  private getChartAsBase64(): string {
    if (this.chart && this.chart.canvas) {
      return this.chart.canvas.toDataURL('image/png');
    }
    return '';
  }

  async generatePDFReport(): Promise<void> {
    try {
      const reportName = await this.getReportNameFromUser();
      if (!reportName) return;

      const pdfData = this.preparePDFData(reportName);

      this.showLoadingAlert('Generando PDF...', 'Por favor espere mientras se genera su reporte');

      await this.pdfGenerator.generatePDF({
        template: this.pdfTemplate,
        data: pdfData,
        showProgress: false
      });

      this.showSuccessAlert('¡PDF Generado!', 'El reporte se ha descargado exitosamente.');

    } catch (error) {
      console.error('Error generando PDF:', error);
      this.showErrorAlert('Error al generar PDF', 'Hubo un problema al generar el reporte. Intente nuevamente.');
    }
  }
  private showLoadingAlert(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }
  private showSuccessAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'success',
      title,
      text,
      timer: 2000,
      showConfirmButton: false
    });
  }
  private showErrorAlert(title: string, text: string): void {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Intentar de nuevo',
      confirmButtonColor: '#dc3545'
    });
  }
  private async getReportNameFromUser(): Promise<string | null> {
    const { value: reportName } = await Swal.fire({
      title: 'Nombre del Reporte',
      text: 'Ingrese el nombre para su reporte PDF:',
      input: 'text',
      inputValue: 'Proyecto Zapata Cuadrada',
      inputPlaceholder: 'Ej: Proyecto Edificio Central',
      showCancelButton: true,
      confirmButtonText: 'Generar PDF',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2c5aa0',
      cancelButtonColor: '#6c757d',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Por favor ingrese un nombre para el reporte';
        }
        if (value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        return null;
      }
    });
    return reportName || null;
  }
}


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZapataExcentricaVigaAmarreService } from '../services/zapata-excentrica-viga-amarre.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import Swal from 'sweetalert2';
import { PDFGeneratorService } from '../services/pdf-generator.service';
import { ZapataExcentricaVigaAmarrePDFTemplate, ZapataExcentricaVigaAmarrePDFData } from './zapata-excentrica-viga-amarre-pdf.template';

@Component({
  selector: 'app-zapata-excentrica-viga-amarre',
  templateUrl: './zapata-excentrica-viga-amarre.component.html',
  styleUrls: ['./zapata-excentrica-viga-amarre.component.css']
})
export class ZapataExcentricaVigaAmarreComponent implements OnInit {
  public chart: Chart | undefined;
  public chartMomento: Chart | undefined;
  
  informations!: FormGroup;
  response: any;
  data: any;
  dataMomento: any;
  mostrarModal: boolean = false;
  tituloModal: string = 'Información del Sistema';
  tamanoModal: 'small' | 'medium' | 'large' = 'medium';
  // función para el botón reusable
  preparePDFDataFn = (name: string) => this.preparePDFData(name);

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly zapataService: ZapataExcentricaVigaAmarreService,
    private readonly pdfGenerator: PDFGeneratorService,
    public readonly pdfTemplate: ZapataExcentricaVigaAmarrePDFTemplate
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.prepararDatosGrafico();
  }

  initializeForm(): void {
    this.informations = this.fb.group({
      // Propiedades del material
      Fc: [210, [Validators.required, Validators.min(0)]],
      Fy: [4200, [Validators.required, Validators.min(0)]],
      Qa: [23.3, [Validators.required, Validators.min(0)]],
      Hz: [60, [Validators.required, Validators.min(0)]],
      
      // Dimensiones de vigas
      Lz: [5, [Validators.required, Validators.min(0)]],
      Av: [40, [Validators.required, Validators.min(0)]],
      Hv: [60, [Validators.required, Validators.min(0)]],
      
      // Cargas columna externa
      PuExt: [70, [Validators.required, Validators.min(0)]],
      CxExt: [30, [Validators.required, Validators.min(0)]],
      CyExt: [40, [Validators.required, Validators.min(0)]],
      
      // Cargas columna interna
      PuInt: [130, [Validators.required, Validators.min(0)]],
      CxInt: [40, [Validators.required, Validators.min(0)]],
      CyInt: [40, [Validators.required, Validators.min(0)]],
      
      // Acero
      ramas: [2, [Validators.required, Validators.min(0)]],
      Nbarras: [{ data: 1.29, item: '1/2' }, Validators.required],
      zapataExtLarga: [{ data: 1.99, item: '5/8' }, Validators.required],
      zapataExtCorta: [{ area: 3.87, Nomen: '7/8' }, Validators.required],
      zapataInt: [{ data: 1.99, item: '5/8' }, Validators.required],
      vgNroBarra: [{ data: 2.84, item: '3/4' }, Validators.required]
    });
  }

  prepararDatosGrafico(): void {
    this.data = {
      labels: [],
      datasets: [{
        label: 'Cortante',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    };

    this.dataMomento = {
      datasets: [{
        label: 'Diagrama de Momento',
        data: [],
        fill: true,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4
      }]
    };
  }

  calculate(): void {
    if (this.informations.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor complete todos los campos requeridos',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Convertir solo los valores numéricos simples a números
    const formData = { ...this.informations.value };
    const numericFields = ['Fc', 'Fy', 'Qa', 'Hz', 'Lz', 'Av', 'Hv', 'PuExt', 'PuInt', 'CxExt', 'CyExt', 'CxInt', 'CyInt', 'ramas'];
    
    for (const key of numericFields) {
      if (key in formData) {
        formData[key] = Number(formData[key]);
      }
    }
    // Los objetos (Nbarras, zapataExtLarga, zapataExtCorta, zapataInt, vgNroBarra) se envían tal cual

    this.zapataService.calculateZapata(formData).subscribe({
      next: (datos) => {
        this.response = datos;

        if (datos.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el cálculo',
            text: datos.message,
            confirmButtonColor: '#d33'
          });
          return;
        }

        // Preparar datos para gráficas
        this.prepareChartData(datos);
        
        // Crear gráficas con delay para asegurar que el DOM esté listo
        setTimeout(() => {
          this.crearGrafico();
          this.crearGraficoMomento();
        }, 100);

        Swal.fire({
          icon: 'success',
          title: 'Cálculo completado',
          text: 'Los cálculos se completaron satisfactoriamente',
          confirmButtonColor: '#3085d6'
        });
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en la solicitud',
          text: 'Ocurrió un error al procesar los datos',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  prepareChartData(datos: any): void {
    // Preparar datos para gráfica de cortante
    if (datos.arrayDataEjeX && datos.arrayDataEjeY) {
      this.data = {
        labels: datos.arrayDataEjeX.map((x: number) => x.toFixed(2)),
        datasets: [{
          label: 'Cortante (Ton)',
          data: datos.arrayDataEjeX.map((x: number, i: number) => ({
            x: x,
            y: datos.arrayDataEjeY[i] || 0
          })),
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 5
        }]
      };
    }

    // Preparar datos para gráfica de momento
    if (datos.momentEjeY && datos.arrayDataEjeX) {
      this.dataMomento = {
        datasets: [{
          label: 'Momento (Ton·m)',
          data: datos.arrayDataEjeX.map((x: number, i: number) => ({
            x: x,
            y: datos.momentEjeY[i] || 0
          })),
          fill: true,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 5
        }]
      };
    }
  }

  crearGrafico(): void {
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
                text: 'Gráfica de Cortante'
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
                  return `${value.y.toFixed(2)}`;
                }
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Distancia (m)'
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
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Cortante (Ton)'
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
                }
              }
            }
          }
        });
      }
    }, 100);
  }

  crearGraficoMomento(): void {
    if (this.chartMomento) {
      this.chartMomento.destroy();
    }

    setTimeout(() => {
      const canvas = document.getElementById('MomentoChart') as HTMLCanvasElement;
      if (canvas) {
        this.chartMomento = new Chart(canvas, {
          type: 'line',
          data: this.dataMomento,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Diagrama de Momento'
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
                  return `${value.y.toFixed(2)}`;
                }
              }
            },
            elements: {
              line: {
                tension: 0.4,
                borderWidth: 3
              },
              point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: 'Distancia (m)'
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
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Momento (Ton·m)'
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
                }
              }
            }
          }
        });
      }
    }, 100);
  }

  mostrarDetalles(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  // Estructura de datos para el PDF
  private preparePDFData(reportName: string): ZapataExcentricaVigaAmarrePDFData {
    return {
      input: this.informations?.value,
      response: this.response,
      metadata: {
        projectName: reportName,
        engineer: 'Ing. Civil',
        client: 'Cliente',
        date: new Date(),
        location: 'Ubicación del Proyecto'
      }
    };
  }
}

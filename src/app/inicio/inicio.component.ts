import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { InicioService } from '../services/inicio.service';
import { Inicio } from '../interface/inicio';
import { Columna } from '../interface/columna';
import { NgModel } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Swal from 'sweetalert2';


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

  constructor(private fb: FormBuilder, private http: HttpClient, private inicioS: InicioService) { }

  ngOnInit(): void {
    this.informations = this.fb.group({
      Fc: ['', [Validators.required, Validators.min(0)]],
      Fy: ['', [Validators.required, Validators.min(0)]],
      Wc: ['', [Validators.required, Validators.min(0)]],
      Ws: ['', [Validators.required, Validators.min(0)]],
      Qa: ['', [Validators.required, Validators.min(0)]],
      Ds: ['', [Validators.required, Validators.min(0)]],
      Hz: ['', [Validators.required, Validators.min(0)]],
      C: ['', [Validators.required, Validators.min(0)]],
      Lz: ['', [Validators.required, Validators.min(0)]],
      PdExt: ['', [Validators.required, Validators.min(0)]],
      PlExt: ['', [Validators.required, Validators.min(0)]],
      CxExt: ['', [Validators.required, Validators.min(0)]],
      CyExt: ['', [Validators.required, Validators.min(0)]],
      PdInt: ['', [Validators.required, Validators.min(0)]],
      PlInt: ['', [Validators.required, Validators.min(0)]],
      CxInt: ['', [Validators.required, Validators.min(0)]],
      CyInt: ['', [Validators.required, Validators.min(0)]]
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
    this.inicioS.calculateZapata(this.informations.value).subscribe({
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

}


import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { zapataCuadradaAislada } from '../services/zapata-cuadrada-simple';
import { PDFGeneratorService } from '../services/pdf-generator.service';
import { ZapataCuadradaPDFTemplate, ZapataCalculationData } from './zapata-cuadrada-pdf.template';
import { DxfExportService } from './zapata-cuadrada-aislada-dfx';

@Component({
  selector: 'app-zapata-cuadrada-aislada',
  templateUrl: './zapata-cuadrada-aislada.component.html',
  styleUrls: ['./zapata-cuadrada-aislada.component.css']
})
export class ZapataCuadradaAisladaComponent implements OnInit {
  informations!: FormGroup;
  tamanoModal: 'small' | 'medium' | 'large' = 'medium';
  mostrarModal: boolean = false;
  tituloModal: string = 'Información del Sistema';
  response: any;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly http: HttpClient, 
    private readonly zapataCuadradaSimple: zapataCuadradaAislada,
    private readonly pdfGenerator: PDFGeneratorService,
    private readonly pdfTemplate: ZapataCuadradaPDFTemplate,
    private readonly dxfExportService: DxfExportService
  ) { }


  ngOnInit(): void {
    this.informations = this.fb.group({
      Fc: [3000],
      Fy: [60000],
      Pd: [889.6],
      Pl: [711.7],
      Cx: [0.45],
      Cy: [0.45],
      Hz: [0.6],
      Ds: [0.924],
      Ws: [15.71],
      Wc: [24],
      Qa: [239.4],
      Rc: [7.5],
      Az: [5]
    });
  }
  cerrarModal() {
    this.mostrarModal = false;
  }

  calculate() {
    this.zapataCuadradaSimple.zapataCuadradaSimple(this.informations.value).subscribe({
      next: (datos) => {
        if (datos.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el cálculo',
            text: datos.message
          });
          return;
        }
        console.log('datos', datos);
        this.response = datos.response;
        this.mostrarModal = true;

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

  /**
   * Genera y descarga el reporte PDF
   */
  async generatePDFReport(): Promise<void> {
    try {
      if (!this.response) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'Primero debe realizar el cálculo antes de generar el reporte.'
        });
        return;
      }

      // Preparar datos para el PDF
      const pdfData: ZapataCalculationData = {
        input: this.informations.value,
        response: this.response,
        metadata: {
          projectName: 'Proyecto Zapata Cuadrada',
          engineer: 'Ing. Civil',
          client: 'Cliente',
          date: new Date(),
          location: 'Ubicación del Proyecto'
        }
      };

      // Mostrar loading
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espere mientras se genera su reporte',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Generar PDF
      await this.pdfGenerator.generatePDF({
        template: this.pdfTemplate,
        data: pdfData,
        showProgress: false // Manejamos el loading con SweetAlert
      });

      // Cerrar loading y mostrar éxito
      Swal.fire({
        icon: 'success',
        title: '¡PDF Generado!',
        text: 'El reporte se ha descargado exitosamente.',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error generando PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar PDF',
        text: 'Hubo un problema al generar el reporte. Intente nuevamente.',
        confirmButtonColor: '#dc3545'
      });
    }
  }

  /**
   * Genera y descarga el archivo DXF
   */
  generateDXFFile(): void {
    try {
      if (!this.response) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin datos',
          text: 'Primero debe realizar el cálculo antes de generar el archivo DXF.'
        });
        return;
      }

      // Mostrar loading
      Swal.fire({
        title: 'Generando DXF...',
        text: 'Por favor espere mientras se genera su archivo DXF',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Generar DXF
      this.dxfExportService.exportarDxfAvanzado();

      // Cerrar loading y mostrar éxito
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: '¡DXF Generado!',
          text: 'El archivo DXF se ha descargado exitosamente.',
          timer: 2000,
          showConfirmButton: false
        });
      }, 500);

    } catch (error) {
      console.error('Error generando DXF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al generar DXF',
        text: 'Hubo un problema al generar el archivo DXF. Intente nuevamente.',
        confirmButtonColor: '#dc3545'
      });
    }
  }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { PDFGeneratorService } from '../../services/pdf-generator.service';

@Component({
  selector: 'app-pdf-report-button',
  templateUrl: './pdf-report-button.component.html',
  styleUrls: ['./pdf-report-button.component.css']
})
export class PdfReportButtonComponent {
  /**
   * Plantilla PDF a utilizar (clase/instancia compatible con PDFGeneratorService)
   */
  @Input() template!: any;

  /**
   * Función que prepara los datos del PDF. Recibe el nombre del reporte
   * y debe retornar el objeto de datos esperado por la plantilla.
   */
  @Input() prepareData!: (reportName: string) => any;

  /** Texto del botón */
  @Input() buttonText: string = 'Generar PDF';

  /** Clases CSS aplicadas al botón */
  @Input() buttonClass: string = 'btn btn-success btn-lg';

  /** Estilo inline opcional */
  @Input() buttonStyle: string = 'padding: 12px 30px; font-size: 16px; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);';

  /** Nombre por defecto para el reporte */
  @Input() defaultReportName: string = 'Proyecto';

  /** Controla si se muestra progreso nativo del servicio */
  @Input() showProgress: boolean = false;

  /** Personalización de textos */
  @Input() loadingTitle: string = 'Generando PDF...';
  @Input() loadingText: string = 'Por favor espere mientras se genera su reporte';
  @Input() successTitle: string = '¡PDF Generado!';
  @Input() successText: string = 'El reporte se ha descargado exitosamente.';
  @Input() errorTitle: string = 'Error al generar PDF';
  @Input() errorText: string = 'Hubo un problema al generar el reporte. Intente nuevamente.';

  /** Evento emitido al completar la generación */
  @Output() generated = new EventEmitter<void>();

  constructor(private readonly pdfGenerator: PDFGeneratorService) {}

  async generate(): Promise<void> {
    try {
      const reportName = await this.askReportName();
      if (!reportName) return;

      const data = this.prepareData(reportName);

      this.showLoadingAlert(this.loadingTitle, this.loadingText);

      await this.pdfGenerator.generatePDF({
        template: this.template,
        data,
        showProgress: this.showProgress
      });

      this.showSuccessAlert(this.successTitle, this.successText);
      this.generated.emit();
    } catch (error) {
      console.error('Error generando PDF:', error);
      this.showErrorAlert(this.errorTitle, this.errorText);
    }
  }

  private async askReportName(): Promise<string | null> {
    const { value } = await Swal.fire({
      title: 'Nombre del Reporte',
      text: 'Ingrese el nombre para su reporte PDF:',
      input: 'text',
      inputValue: this.defaultReportName,
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
    return value || null;
  }

  private showLoadingAlert(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
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
}

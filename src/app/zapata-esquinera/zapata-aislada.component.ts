import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { zapataEsquineraService } from '../services/zapata-esquinera';
import { PDFGeneratorService } from '../services/pdf-generator.service';
import { ZapataCuadradaPDFTemplate, ZapataCalculationData } from '../zapata-cuadrada-aislada/zapata-cuadrada-pdf.template';
import { DxfExportService } from '../zapata-cuadrada-aislada/zapata-cuadrada-aislada-dfx';

@Component({
  selector: 'app-zapata-aislada',
  templateUrl: './zapata-aislada.component.html',
  styleUrls: ['./zapata-aislada.component.css']
})
export class ZapataAisladaComponent implements OnInit {
  informations!: FormGroup;
  tamanoModal: 'small' | 'medium' | 'large' = 'medium';
  mostrarModal: boolean = false;
  tituloModal: string = 'Información del Sistema';
  response: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly zapataEsquineraService: zapataEsquineraService,
    private readonly pdfGenerator: PDFGeneratorService,
    private readonly pdfTemplate: ZapataCuadradaPDFTemplate,
    private readonly dxfExportService: DxfExportService
  ) { }

  ngOnInit(): void {
    this.informations = this.fb.group({
      Fc: [3000, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Fy: [60000, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Pd: [400, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Pl: [180, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Cx: [0.45, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Cy: [0.45, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Hz: [0.6, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Ds: [0.924, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Ws: [15.71, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Wc: [24, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Qa: [239.4, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Rc: [7.5, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]],
      Az: [5, [
        Validators.required,
        this.minLengthNumberValidator(1),
        this.maxLengthValidator(10)
      ]]
    });
  }

  /**
   * Validador personalizado para limitar la longitud máxima del número
   */
  private maxLengthValidator(maxLength: number) {
    return (control: any) => {
      if (!control.value && control.value !== 0) {
        return null;
      }
      const valueString = control.value.toString();
      return valueString.length > maxLength ? { maxLength: { actualLength: valueString.length, requiredLength: maxLength } } : null;
    };
  }

  /**
   * Validador personalizado para longitud mínima de números
   */
  private minLengthNumberValidator(minLength: number) {
    return (control: any) => {
      if (!control.value && control.value !== 0) {
        return null;
      }
      const valueString = control.value.toString();
      return valueString.length < minLength ? { minlength: { actualLength: valueString.length, requiredLength: minLength } } : null;
    };
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  /**
   * Maneja inputs numéricos con conversión de comas a puntos
   */
  handleNumericInput(event: any, maxLength: number): void {
    const input = event.target;
    let value = input.value;

    value = value.replace(/[^0-9.,]/gi, '');

    if (value.includes(',')) {
      value = value.replace(/,/g, '.');
    }

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

    if (value.length > maxLength) {
      value = value.substring(0, maxLength);
    }

    input.value = value;

    const controlName = input.getAttribute('formControlName');
    if (controlName) {
      const numericValue = value === '' ? null : parseFloat(value);
      this.informations.get(controlName)?.setValue(isNaN(numericValue as number) ? undefined : numericValue);
    }
  }

  /**
   * Maneja el evento keydown para prevenir entrada excesiva
   */
  handleKeydown(event: KeyboardEvent, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';

    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter'];
    if (controlKeys.includes(event.key)) {
      return;
    }

    const allowedKeys = /[0-9.,]/;
    if (!allowedKeys.test(event.key)) {
      event.preventDefault();
      return;
    }

    if ((event.key === '.' || event.key === ',') && (currentValue.includes('.') || currentValue.includes(','))) {
      event.preventDefault();
      return;
    }

    if (currentValue.length >= maxLength) {
      event.preventDefault();
    }
  }

  /**
   * Maneja el evento paste para limitar contenido pegado
   */
  handlePaste(event: ClipboardEvent, maxLength: number): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';

    let processedText = pastedText.replace(/[^0-9.,]/gi, '');

    processedText = processedText.replace(/,/g, '.');

    if (processedText.length > maxLength) {
      processedText = processedText.substring(0, maxLength);
    }

    input.value = processedText;

    const controlName = input.getAttribute('formControlName');
    if (controlName) {
      const numericValue = processedText === '' ? null : parseFloat(processedText);
      this.informations.get(controlName)?.setValue(isNaN(numericValue as number) ? undefined : numericValue);
    }
  }

  calculate(): void {
    this.zapataEsquineraService.zapataEsquinera(this.informations.value).subscribe({
      next: (datos) => {
        if (datos.error) {
          this.showErrorAlert('Error en el cálculo', datos.message);
          return;
        }
        this.response = datos.response;
        this.mostrarModal = true;
      },
      error: (error) => {
        console.error('Error en la petición:', error);
        this.showErrorAlert(
          'Error de conexión',
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        );
      }
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

  /**
   * Genera y descarga el reporte PDF
   */
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

  private async getReportNameFromUser(): Promise<string | null> {
    const { value: reportName } = await Swal.fire({
      title: 'Nombre del Reporte',
      text: 'Ingrese el nombre para su reporte PDF:',
      input: 'text',
      inputValue: 'Proyecto Zapata Esquinera',
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

  private preparePDFData(reportName: string): ZapataCalculationData {
    return {
      input: this.informations.value,
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

  /**
   * Genera y descarga el archivo DXF
   */
  generateDXFFile(): void {
    try {
      if (!this.validateResponseData()) return;

      this.showLoadingAlert('Generando DXF...', 'Por favor espere mientras se genera su archivo DXF');
      
      this.dxfExportService.exportarDxfAvanzado();

      setTimeout(() => {
        this.showSuccessAlert('¡DXF Generado!', 'El archivo DXF se ha descargado exitosamente.');
      }, 500);

    } catch (error) {
      console.error('Error generando DXF:', error);
      this.showErrorAlert('Error al generar DXF', 'Hubo un problema al generar el archivo DXF. Intente nuevamente.');
    }
  }

  private validateResponseData(): boolean {
    if (!this.response) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'Primero debe realizar el cálculo antes de generar el archivo DXF.'
      });
      return false;
    }
    return true;
  }
}
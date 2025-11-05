/**
 * PDFGeneratorService - Servicio general para generación de PDFs
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja generación de PDFs
 * - Open/Closed: Extensible para diferentes tipos de reportes
 * - Dependency Inversion: Usa templates abstractos
 */

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFTemplate {
  generateContent(data: any): string;
  getFileName(data: any): string;
  getPageOptions(): PDFPageOptions;
}

export interface PDFPageOptions {
  orientation?: 'portrait' | 'landscape';
  unit?: 'mm' | 'cm' | 'in' | 'px';
  format?: string | number[];
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PDFGenerationOptions {
  template: PDFTemplate;
  data: any;
  showProgress?: boolean;
  quality?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PDFGeneratorService {

  /**
   * Genera un PDF usando un template específico
   * @param options - Opciones de generación
   * @returns Promise<void>
   */
  async generatePDF(options: PDFGenerationOptions): Promise<void> {
    try {
      const { template, data, showProgress = true, quality = 2 } = options;
      
      if (showProgress) {
        this.showLoadingIndicator('Generando reporte PDF...');
      }

      // Obtener configuración de página del template
      const pageOptions = template.getPageOptions();
      
      // Crear instancia de jsPDF
      const doc = new jsPDF({
        orientation: pageOptions.orientation || 'portrait',
        unit: pageOptions.unit || 'mm',
        format: pageOptions.format || 'a4'
      });

      // Generar contenido HTML del template
      const htmlContent = template.generateContent(data);
      
      // Crear elemento temporal para renderizar el HTML
      const tempElement = this.createTempElement(htmlContent);
      
      // Esperar un momento para que se apliquen los estilos
      await new Promise(resolve => setTimeout(resolve, 100));

      // Convertir HTML a canvas con configuración optimizada
      const canvas = await html2canvas(tempElement, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: tempElement.scrollHeight,
        width: tempElement.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        logging: false,

      });

      // Obtener dimensiones de la página
      const imgWidth = doc.internal.pageSize.getWidth() - (pageOptions.margins?.left || 10) - (pageOptions.margins?.right || 10);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = doc.internal.pageSize.getHeight() - (0) - (pageOptions.margins?.bottom || 10);

      let heightLeft = imgHeight;
      let position = 0;

      // Convertir canvas a imagen
      const imgData = canvas.toDataURL('image/png');

      // Agregar imagen al PDF con mejor control de paginación
      if (imgHeight <= pageHeight) {
        // Si cabe en una sola página
        doc.addImage(
          imgData, 
          'PNG', 
          pageOptions.margins?.left || 10, 
          position, 
          imgWidth, 
          imgHeight
        );
      } else {
        // Si necesita múltiples páginas
        doc.addImage(
          imgData, 
          'PNG', 
          pageOptions.margins?.left || 10, 
          position, 
          imgWidth, 
          imgHeight
        );
        
        heightLeft -= pageHeight;

        // Agregar páginas adicionales si es necesario
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + (0);
          doc.addPage();
          doc.addImage(
            imgData, 
            'PNG', 
            pageOptions.margins?.left || 10, 
            position, 
            imgWidth, 
            imgHeight
          );
          heightLeft -= pageHeight;
        }
      }

      // Limpiar elemento temporal
      this.removeTempElement(tempElement);

      // Generar nombre del archivo
      const fileName = template.getFileName(data);
      
      // Descargar PDF
      doc.save(fileName);

      if (showProgress) {
        this.hideLoadingIndicator();
        this.showSuccessMessage('PDF generado exitosamente');
      }

    } catch (error) {
      console.error('Error generando PDF:', error);
      this.hideLoadingIndicator();
      this.showErrorMessage('Error al generar el PDF. Intente nuevamente.');
      throw error;
    }
  }

  /**
   * Crea un elemento temporal para renderizar HTML
   * @private
   */
  private createTempElement(htmlContent: string): HTMLElement {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '794px'; // Ancho A4 en px aproximado
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.padding = '0'; // Sin padding extra
    tempDiv.style.margin = '0';
    tempDiv.style.boxSizing = 'border-box';
    tempDiv.style.overflow = 'visible';
    
    document.body.appendChild(tempDiv);
    return tempDiv;
  }

  /**
   * Elimina elemento temporal
   * @private
   */
  private removeTempElement(element: HTMLElement): void {
    element?.remove();
  }

  /**
   * Muestra indicador de carga
   * @private
   */
  private showLoadingIndicator(message: string): void {
    console.log(`📄 ${message}`);
  }

  /**
   * Oculta indicador de carga
   * @private
   */
  private hideLoadingIndicator(): void {
    console.log('✅ PDF generation completed');
  }

  /**
   * Muestra mensaje de éxito
   * @private
   */
  private showSuccessMessage(message: string): void {
    console.log(`✅ ${message}`);
  }

  /**
   * Muestra mensaje de error
   * @private
   */
  private showErrorMessage(message: string): void {
    console.error(`❌ ${message}`);
  }

}
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
      const { template, data, showProgress = true, quality = 1 } = options;
      
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
        onclone: (clonedDoc) => {
          // Asegurar que los estilos del grid se apliquen
          const style = clonedDoc.createElement('style');
          style.textContent = `
            .input-grid { 
              display: grid !important; 
              grid-template-columns: repeat(3, 1fr) !important; 
              gap: 15px !important; 
              margin-bottom: 20px !important;
            }
            .input-item { 
              background-color: #f8f9fa !important; 
              padding: 10px !important; 
              border: 1px solid #e9ecef !important; 
              border-radius: 5px !important; 
            }
            .input-label {
              font-weight: bold !important;
              color: #495057 !important;
              font-size: 14px !important;
            }
            .input-value {
              font-size: 16px !important;
              color: #2c5aa0 !important;
              font-weight: bold !important;
              margin-top: 3px !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Obtener dimensiones de la página
      const imgWidth = doc.internal.pageSize.getWidth() - (pageOptions.margins?.left || 10) - (pageOptions.margins?.right || 10);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = doc.internal.pageSize.getHeight() - (pageOptions.margins?.top || 10) - (pageOptions.margins?.bottom || 10);

      let heightLeft = imgHeight;
      let position = pageOptions.margins?.top || 10;

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
          position = heightLeft - imgHeight + (pageOptions.margins?.top || 10);
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
   * Genera PDF desde un elemento HTML específico
   * @param elementId - ID del elemento HTML
   * @param fileName - Nombre del archivo
   * @param options - Opciones adicionales
   */
  async generateFromElement(
    elementId: string, 
    fileName: string, 
    options: Partial<PDFPageOptions> = {}
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Elemento con ID '${elementId}' no encontrado`);
      }

      this.showLoadingIndicator('Generando reporte PDF...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const doc = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: options.unit || 'mm',
        format: options.format || 'a4'
      });

      const imgWidth = doc.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      doc.save(fileName);

      this.hideLoadingIndicator();
      this.showSuccessMessage('PDF generado exitosamente');

    } catch (error) {
      console.error('Error generando PDF desde elemento:', error);
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
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '794px'; // Ancho A4 en px aproximado
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.padding = '0'; // Sin padding extra
    tempDiv.style.margin = '0';
    tempDiv.style.boxSizing = 'border-box';
    tempDiv.style.overflow = 'visible';
    
    document.body.appendChild(tempDiv);
    
    // Dar tiempo para que se apliquen los estilos
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; }
      .input-grid { 
        display: grid !important; 
        grid-template-columns: repeat(3, 1fr) !important; 
        gap: 15px !important; 
      }
      .input-item { 
        background-color: #f8f9fa !important; 
        padding: 10px !important; 
        border: 1px solid #e9ecef !important; 
        border-radius: 5px !important; 
      }
    `;
    tempDiv.appendChild(style);
    
    return tempDiv;
  }

  /**
   * Elimina elemento temporal
   * @private
   */
  private removeTempElement(element: HTMLElement): void {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  /**
   * Muestra indicador de carga
   * @private
   */
  private showLoadingIndicator(message: string): void {
    // Implementar loading indicator
    console.log(`Loading: ${message}`);
  }

  /**
   * Oculta indicador de carga
   * @private
   */
  private hideLoadingIndicator(): void {
    // Implementar hide loading
    console.log('Loading hidden');
  }

  /**
   * Muestra mensaje de éxito
   * @private
   */
  private showSuccessMessage(message: string): void {
    // Implementar con SweetAlert2 o similar
    console.log(`Success: ${message}`);
  }

  /**
   * Muestra mensaje de error
   * @private
   */
  private showErrorMessage(message: string): void {
    // Implementar con SweetAlert2 o similar
    console.error(`Error: ${message}`);
  }

  /**
   * Método alternativo para generar PDF sin html2canvas (mejor control de layout)
   * @param options - Opciones de generación
   */
  async generateDirectPDF(options: PDFGenerationOptions): Promise<void> {
    try {
      const { template, data, showProgress = true } = options;
      
      if (showProgress) {
        this.showLoadingIndicator('Generando reporte PDF (método directo)...');
      }

      const pageOptions = template.getPageOptions();
      const doc = new jsPDF({
        orientation: pageOptions.orientation || 'portrait',
        unit: pageOptions.unit || 'mm',
        format: pageOptions.format || 'a4'
      });

      // Este método se puede expandir para generar contenido directamente
      // con jsPDF sin depender de HTML renderizado
      
      // Por ahora, usar el método normal pero con configuración optimizada
      const htmlContent = template.generateContent(data);
      const tempElement = this.createTempElement(htmlContent);
      
      // Usar configuración más específica para el canvas
      const canvas = await html2canvas(tempElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Aplicar estilos específicos al documento clonado
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { box-sizing: border-box; }
            .section { page-break-inside: avoid !important; break-inside: avoid !important; }
            .section-header { page-break-after: avoid !important; break-after: avoid !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgWidth = doc.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      this.removeTempElement(tempElement);

      const fileName = template.getFileName(data);
      doc.save(fileName);

      if (showProgress) {
        this.hideLoadingIndicator();
        this.showSuccessMessage('PDF generado exitosamente (método optimizado)');
      }

    } catch (error) {
      console.error('Error generando PDF directo:', error);
      this.hideLoadingIndicator();
      this.showErrorMessage('Error al generar el PDF. Intente nuevamente.');
      throw error;
    }
  }
}
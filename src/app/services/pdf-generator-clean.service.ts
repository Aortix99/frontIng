/**
 * PDFGeneratorService - Servicio limpio para generación de PDFs
 * Aplica principios SOLID y elimina código redundante
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
   */
  async generatePDF(options: PDFGenerationOptions): Promise<void> {
    try {
      const { template, data, showProgress = true, quality = 2 } = options;
      
      if (showProgress) {
        console.log('Generando reporte PDF...');
      }

      // Obtener configuración del template
      const pageOptions = template.getPageOptions();
      const htmlContent = template.generateContent(data);
      
      // Crear documento PDF
      const doc = new jsPDF({
        orientation: pageOptions.orientation || 'portrait',
        unit: pageOptions.unit || 'mm',
        format: pageOptions.format || 'a4'
      });

      // Renderizar HTML a canvas
      const canvas = await this.renderHTMLToCanvas(htmlContent, quality);
      
      // Agregar imagen al PDF con paginación automática
      this.addCanvasToPDF(doc, canvas, pageOptions);

      // Descargar archivo
      const fileName = template.getFileName(data);
      doc.save(fileName);

      if (showProgress) {
        console.log('PDF generado exitosamente');
      }

    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  }

  /**
   * Renderiza HTML a canvas
   */
  private async renderHTMLToCanvas(htmlContent: string, quality: number): Promise<HTMLCanvasElement> {
    const tempElement = this.createTempElement(htmlContent);
    
    // Esperar que se apliquen los estilos
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(tempElement, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    this.removeTempElement(tempElement);
    return canvas;
  }

  /**
   * Agrega canvas al PDF con manejo de múltiples páginas
   */
  private addCanvasToPDF(doc: jsPDF, canvas: HTMLCanvasElement, pageOptions: PDFPageOptions): void {
    const margins = {
      left: pageOptions.margins?.left || 10,
    //   top: pageOptions.margins?.top || 10,
      right: pageOptions.margins?.right || 10,
      bottom: pageOptions.margins?.bottom || 10
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const imgWidth = pageWidth - margins.left - margins.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const availableHeight = pageHeight - margins.bottom;

    const imgData = canvas.toDataURL('image/png');

    if (imgHeight <= availableHeight) {
      // Cabe en una página
      doc.addImage(imgData, 'PNG', margins.left, imgWidth, imgHeight);
    } else {
      // Múltiples páginas
      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      doc.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
      heightLeft -= availableHeight;

      // Páginas adicionales
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight ;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
        heightLeft -= availableHeight;
      }
    }
  }

  /**
   * Crea elemento temporal para renderizar HTML
   */
  private createTempElement(htmlContent: string): HTMLElement {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      width: 794px;
      background-color: #ffffff;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      overflow: visible;
    `;
    
    document.body.appendChild(tempDiv);
    return tempDiv;
  }

  /**
   * Elimina elemento temporal
   */
  private removeTempElement(element: HTMLElement): void {
    element?.parentNode?.removeChild(element);
  }
}
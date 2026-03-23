/**
 * PDFGeneratorService — generación de PDFs con jsPDF + html2canvas.
 * Tamaño estándar: **carta (Letter)**. Paginación por rebanado del canvas del cuerpo;
 * si la plantilla define encabezado, el logo se repite en cada página.
 */

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  PDF_REPORT_CONTENT_WIDTH_PX,
  getPdfReportBodyBaseStyles,
  getPdfReportHeaderStyles,
} from '../shared/pdf-report/pdf-report-header';

export interface PDFTemplate {
  generateContent(data: any): string;
  getFileName(data: any): string;
  getPageOptions(): PDFPageOptions;
  /**
   * HTML del bloque de encabezado (logo + título). Si existe, `generateContent` no debe
   * incluir ese encabezado; el servicio lo dibuja arriba en cada página.
   */
  generateHeaderHtml?(data: any): string;
}

/** Carta US: 21,59 cm × 27,94 cm (215,9 × 279,4 mm). */
export function getStandardLetterPdfPageOptions(): PDFPageOptions {
  return {
    orientation: 'portrait',
    unit: 'mm',
    format: [215.9, 279.4],
    margins: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15,
    },
  };
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
  /** Escala html2canvas (2 es un buen balance calidad/tamaño) */
  quality?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PDFGeneratorService {

  async generatePDF(options: PDFGenerationOptions): Promise<void> {
    try {
      const { template, data, showProgress = true, quality = 2 } = options;

      if (showProgress) {
        this.showLoadingIndicator('Generando reporte PDF...');
      }

      const pageOptions = template.getPageOptions();
      const bodyHtml = template.generateContent(data);
      const headerFragment = template.generateHeaderHtml?.(data);

      const doc = new jsPDF({
        orientation: pageOptions.orientation || 'portrait',
        unit: pageOptions.unit || 'mm',
        format: pageOptions.format ?? [215.9, 279.4],
      });

      if (headerFragment) {
        const headerHtml = this.wrapHeaderFragmentForCanvas(headerFragment);
        const headerCanvas = await this.renderHTMLToCanvas(headerHtml, quality);
        const bodyCanvas = await this.renderHTMLToCanvas(bodyHtml, quality);
        this.addCanvasToPDFWithHeader(doc, headerCanvas, bodyCanvas, pageOptions);
      } else {
        const canvas = await this.renderHTMLToCanvas(bodyHtml, quality);
        this.addCanvasToPDF(doc, canvas, pageOptions);
      }

      const fileName = template.getFileName(data);
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

  private async renderHTMLToCanvas(htmlContent: string, quality: number): Promise<HTMLCanvasElement> {
    const tempElement = this.createTempElement(htmlContent);

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(tempElement, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: tempElement.scrollWidth,
        height: tempElement.scrollHeight,
        windowWidth: tempElement.scrollWidth,
        windowHeight: tempElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      return canvas;
    } finally {
      this.removeTempElement(tempElement);
    }
  }

  /** Brillo medio de una fila de píxeles (0–255). */
  private rowAvgBrightness(
    ctx: CanvasRenderingContext2D,
    width: number,
    y: number,
  ): number {
    const d = ctx.getImageData(0, y, width, 1).data;
    let sum = 0;
    const step = Math.max(1, Math.floor(width / 400));
    let n = 0;
    for (let x = 0; x < width; x += step) {
      const i = x * 4;
      sum += d[i] + d[i + 1] + d[i + 2];
      n += 1;
    }
    return sum / (n * 3);
  }

  /**
   * Fila donde empieza un hueco claro bajo contenido más oscuro (entre bloques del informe).
   */
  private isGapStartRow(
    ctx: CanvasRenderingContext2D,
    width: number,
    y: number,
  ): boolean {
    if (y < 1) {
      return false;
    }
    const cur = this.rowAvgBrightness(ctx, width, y);
    const prev = this.rowAvgBrightness(ctx, width, y - 1);
    /* Fila clara tras contenido (verde, texto, líneas): salto visible de brillo */
    return cur >= 251 && prev <= 250 && cur - prev >= 3;
  }

  /**
   * Ajusta el fin de franja hacia arriba para cortar en un hueco entre bloques,
   * en lugar de partir a la mitad una tarjeta o un párrafo.
   */
  private findBodySliceEndY(
    canvas: HTMLCanvasElement,
    startY: number,
    targetEndY: number,
    searchBackPx: number,
    minSlicePx: number,
  ): number {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return targetEndY;
    }
    const w = canvas.width;
    const cap = Math.min(targetEndY, canvas.height);
    const searchMin = Math.max(startY + minSlicePx, targetEndY - searchBackPx);
    for (let y = cap - 1; y >= searchMin; y--) {
      if (this.isGapStartRow(ctx, w, y)) {
        return y;
      }
    }
    return targetEndY;
  }

  /**
   * Franja horizontal en la plantilla (SpringGreen #00ff7f) para forzar corte del canvas
   * antes de “Verificaciones” / resultados; html2canvas no aplica page-break CSS.
   */
  private isPdfSliceBreakMarkerRow(
    ctx: CanvasRenderingContext2D,
    width: number,
    y: number,
  ): boolean {
    const d = ctx.getImageData(0, y, width, 1).data;
    const step = Math.max(1, Math.floor(width / 120));
    let hits = 0;
    let n = 0;
    for (let x = 0; x < width; x += step) {
      const i = x * 4;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      if (g > 210 && r < 55 && b > 70 && b < 200) {
        hits++;
      }
      n++;
    }
    return n > 0 && hits / n > 0.45;
  }

  /** Primera fila del marcador en (offset + minSlice, targetEnd): fin de franja exclusivo. */
  private findForcedSliceEndAtMarker(
    canvas: HTMLCanvasElement,
    offsetYpx: number,
    targetEndY: number,
    minSlicePx: number,
  ): number | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    const w = canvas.width;
    const scanFrom = offsetYpx + minSlicePx;
    const scanTo = Math.min(targetEndY, canvas.height);
    if (scanFrom >= scanTo) {
      return null;
    }
    for (let y = scanFrom; y < scanTo; y++) {
      if (this.isPdfSliceBreakMarkerRow(ctx, w, y)) {
        return y;
      }
    }
    return null;
  }

  /** Primera fila del marcador en el canvas (para decidir si hace falta paginar aunque “quepa” en una franja). */
  private findFirstPdfSliceBreakMarkerY(canvas: HTMLCanvasElement): number | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    const w = canvas.width;
    const minSlicePx = 56;
    for (let y = minSlicePx; y < canvas.height - 1; y++) {
      if (this.isPdfSliceBreakMarkerRow(ctx, w, y)) {
        return y;
      }
    }
    return null;
  }

  /** No dibujar en el PDF la franja de sincronización (solo guía de corte). */
  private skipPdfSliceBreakMarkerStrip(
    canvas: HTMLCanvasElement,
    startY: number,
  ): number {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return startY;
    }
    const w = canvas.width;
    let y = startY;
    const maxStrip = 12;
    let n = 0;
    while (
      y < canvas.height &&
      n < maxStrip &&
      this.isPdfSliceBreakMarkerRow(ctx, w, y)
    ) {
      y++;
      n++;
    }
    return y;
  }

  private resolveBodySliceEndY(
    canvas: HTMLCanvasElement,
    offsetYpx: number,
    targetEndY: number,
    searchBackPx: number,
    minSlicePx: number,
  ): number {
    if (targetEndY >= canvas.height || targetEndY - offsetYpx < minSlicePx) {
      return targetEndY;
    }
    const forced = this.findForcedSliceEndAtMarker(
      canvas,
      offsetYpx,
      targetEndY,
      minSlicePx,
    );
    if (forced != null) {
      return forced;
    }
    let sliceEndY = this.findBodySliceEndY(
      canvas,
      offsetYpx,
      targetEndY,
      searchBackPx,
      minSlicePx,
    );
    if (sliceEndY - offsetYpx < minSlicePx) {
      sliceEndY = targetEndY;
    }
    return sliceEndY;
  }

  /**
   * Encabezado + cuerpo: el encabezado se repite en cada página.
   * El cuerpo se divide en franjas en el canvas (no se confía en recortar una imagen gigante),
   * para que la paginación sea estable en todos los visores PDF.
   */
  private addCanvasToPDFWithHeader(
    doc: jsPDF,
    headerCanvas: HTMLCanvasElement,
    bodyCanvas: HTMLCanvasElement,
    pageOptions: PDFPageOptions,
  ): void {
    const margins = {
      left: pageOptions.margins?.left ?? 15,
      top: pageOptions.margins?.top ?? 15,
      right: pageOptions.margins?.right ?? 15,
      bottom: pageOptions.margins?.bottom ?? 15,
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imgWidth = pageWidth - margins.left - margins.right;
    const headerHeightMm =
      (headerCanvas.height / headerCanvas.width) * imgWidth;
    const bodyImgHeightMm = (bodyCanvas.height / bodyCanvas.width) * imgWidth;

    const headerData = headerCanvas.toDataURL('image/png');

    const yBodyStart = margins.top + headerHeightMm;
    const availableBody = pageHeight - yBodyStart - margins.bottom;

    if (availableBody <= 0) {
      this.addCanvasToPDF(doc, bodyCanvas, pageOptions);
      return;
    }

    const breakMarkerY = this.findFirstPdfSliceBreakMarkerY(bodyCanvas);
    const fitsOneBodyPage = bodyImgHeightMm <= availableBody + 0.02;
    if (fitsOneBodyPage && breakMarkerY == null) {
      doc.addImage(
        headerData,
        'PNG',
        margins.left,
        margins.top,
        imgWidth,
        headerHeightMm,
      );
      doc.addImage(
        bodyCanvas.toDataURL('image/png'),
        'PNG',
        margins.left,
        yBodyStart,
        imgWidth,
        bodyImgHeightMm,
      );
      return;
    }

    const mmPerPxY = bodyImgHeightMm / bodyCanvas.height;
    const pxPerPage = Math.max(1, Math.floor(availableBody / mmPerPxY));
    const searchBackPx = 520;
    const minSlicePx = 56;

    let offsetYpx = 0;
    let pageIndex = 0;

    while (offsetYpx < bodyCanvas.height) {
      const remainingPx = bodyCanvas.height - offsetYpx;
      const targetEnd = offsetYpx + Math.min(pxPerPage, remainingPx);
      let sliceEndY = targetEnd;
      if (targetEnd < bodyCanvas.height && targetEnd - offsetYpx >= minSlicePx) {
        sliceEndY = this.resolveBodySliceEndY(
          bodyCanvas,
          offsetYpx,
          targetEnd,
          searchBackPx,
          minSlicePx,
        );
      }
      const slicePx = sliceEndY - offsetYpx;
      if (slicePx <= 0) {
        break;
      }
      const sliceHeightMm = slicePx * mmPerPxY;

      if (pageIndex > 0) {
        doc.addPage();
      }

      doc.addImage(
        headerData,
        'PNG',
        margins.left,
        margins.top,
        imgWidth,
        headerHeightMm,
      );

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = bodyCanvas.width;
      sliceCanvas.height = slicePx;
      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          bodyCanvas,
          0,
          offsetYpx,
          bodyCanvas.width,
          slicePx,
          0,
          0,
          bodyCanvas.width,
          slicePx,
        );
      }
      doc.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        margins.left,
        yBodyStart,
        imgWidth,
        sliceHeightMm,
      );

      offsetYpx += slicePx;
      offsetYpx = this.skipPdfSliceBreakMarkerStrip(bodyCanvas, offsetYpx);
      pageIndex++;
    }
  }

  /**
   * Inserta la imagen larga en páginas recortando el excedente vertical.
   */
  private addCanvasToPDF(doc: jsPDF, canvas: HTMLCanvasElement, pageOptions: PDFPageOptions): void {
    const margins = {
      left: pageOptions.margins?.left ?? 15,
      top: pageOptions.margins?.top ?? 15,
      right: pageOptions.margins?.right ?? 15,
      bottom: pageOptions.margins?.bottom ?? 15,
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imgWidth = pageWidth - margins.left - margins.right;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const availableHeight = pageHeight - margins.top - margins.bottom;

    const imgData = canvas.toDataURL('image/png');

    const breakMarkerY = this.findFirstPdfSliceBreakMarkerY(canvas);
    const fitsOnePage = imgHeight <= availableHeight + 0.02;
    if (fitsOnePage && breakMarkerY == null) {
      doc.addImage(imgData, 'PNG', margins.left, margins.top, imgWidth, imgHeight);
      return;
    }

    const mmPerPxY = imgHeight / canvas.height;
    const pxPerPage = Math.max(1, Math.floor(availableHeight / mmPerPxY));
    const searchBackPx = 520;
    const minSlicePx = 56;
    let offsetYpx = 0;
    let pageIndex = 0;

    while (offsetYpx < canvas.height) {
      const remainingPx = canvas.height - offsetYpx;
      const targetEnd = offsetYpx + Math.min(pxPerPage, remainingPx);
      let sliceEndY = targetEnd;
      if (targetEnd < canvas.height && targetEnd - offsetYpx >= minSlicePx) {
        sliceEndY = this.resolveBodySliceEndY(
          canvas,
          offsetYpx,
          targetEnd,
          searchBackPx,
          minSlicePx,
        );
      }
      const slicePx = sliceEndY - offsetYpx;
      if (slicePx <= 0) {
        break;
      }
      const sliceHeightMm = slicePx * mmPerPxY;

      if (pageIndex > 0) {
        doc.addPage();
      }

      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = slicePx;
      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          offsetYpx,
          canvas.width,
          slicePx,
          0,
          0,
          canvas.width,
          slicePx,
        );
      }
      doc.addImage(
        sliceCanvas.toDataURL('image/png'),
        'PNG',
        margins.left,
        margins.top,
        imgWidth,
        sliceHeightMm,
      );

      offsetYpx += slicePx;
      offsetYpx = this.skipPdfSliceBreakMarkerStrip(canvas, offsetYpx);
      pageIndex++;
    }
  }

  /** Fragmento de encabezado + estilos compartidos para captura en canvas. */
  private wrapHeaderFragmentForCanvas(headerFragment: string): string {
    return `
      <div id="pdf-header-canvas-root" style="width:${PDF_REPORT_CONTENT_WIDTH_PX}px;background:#ffffff;box-sizing:border-box;margin:0;padding:0;">
        <style>
          ${getPdfReportBodyBaseStyles()}
          ${getPdfReportHeaderStyles()}
          #pdf-header-canvas-root .pdf-header { margin-top: 0 !important; margin-bottom: 8px; }
        </style>
        ${headerFragment}
      </div>`;
  }

  private createTempElement(htmlContent: string): HTMLElement {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: ${PDF_REPORT_CONTENT_WIDTH_PX}px;
      background-color: #ffffff;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      overflow: visible;
      font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    `;
    document.body.appendChild(tempDiv);
    return tempDiv;
  }

  private removeTempElement(element: HTMLElement): void {
    element?.remove();
  }

  private showLoadingIndicator(message: string): void {
    console.log(`📄 ${message}`);
  }

  private hideLoadingIndicator(): void {
    console.log('✅ PDF generation completed');
  }

  private showSuccessMessage(message: string): void {
    console.log(`✅ ${message}`);
  }

  private showErrorMessage(message: string): void {
    console.error(`❌ ${message}`);
  }
}

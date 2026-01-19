import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';

export interface ZapataExcentricaVigaAmarrePDFData {
  input: any; // Ajusta tipos específicos cuando definas el contenido
  response: any; // Datos de cálculo devueltos por el servicio
  metadata: {
    projectName?: string;
    engineer?: string;
    client?: string;
    date?: Date;
    location?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ZapataExcentricaVigaAmarrePDFTemplate implements PDFTemplate {
  generateContent(data: ZapataExcentricaVigaAmarrePDFData): string {
    const currentDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // Plantilla mínima; reemplaza con contenido final cuando esté listo
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { color: #2c5aa0; margin: 0 0 6px 0; }
            .meta { margin: 10px 0 20px; color: #555; }
            .section { margin-top: 16px; }
            .label { font-weight: bold; color: #2c5aa0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .card { background: #f8f9fa; padding: 10px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <h1>${data.metadata.projectName || 'Zapata Excéntrica con Viga de Amarre'}</h1>
          <div class="meta">Fecha: ${currentDate} · Cliente: ${data.metadata.client || ''} · Ingeniero: ${data.metadata.engineer || ''}</div>

          <div class="section">
            <div class="label">Datos de entrada</div>
            <div class="card">
              <pre>${JSON.stringify(data.input, null, 2)}</pre>
            </div>
          </div>

          <div class="section">
            <div class="label">Resultados</div>
            <div class="card">
              <pre>${JSON.stringify(data.response, null, 2)}</pre>
            </div>
          </div>

          <div class="section">
            <div class="label">Ubicación</div>
            <div>${data.metadata.location || ''}</div>
          </div>
        </body>
      </html>
    `;
  }

  getFileName(data: ZapataExcentricaVigaAmarrePDFData): string {
    const projectName = (data.metadata?.projectName || 'ZapataExcentricaVigaAmarre').trim();
    const timestamp = new Date().toISOString().slice(0,16).replaceAll(/[:-]/g, '');
    return `${projectName}_${timestamp}.pdf`;
  }

  getPageOptions(): PDFPageOptions {
    return {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      margins: { top: 15, right: 15, bottom: 15, left: 15 }
    };
  }
}

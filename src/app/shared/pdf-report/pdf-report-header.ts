/**
 * Encabezado y estilos compartidos para todos los PDF generados vía html2canvas.
 * Un solo lugar para logo, título, subtítulo y fecha — misma distribución en todos los reportes.
 */

/**
 * Ancho CSS (px) del HTML capturado por html2canvas.
 * Calibrado para **carta (Letter)** con márgenes 15 mm en el PDF (ancho útil ~185,9 mm).
 */
export const PDF_REPORT_CONTENT_WIDTH_PX = 820;

/**
 * @deprecated Usar {@link PDF_REPORT_CONTENT_WIDTH_PX}
 */
export const PDF_A4_CONTENT_WIDTH_PX = PDF_REPORT_CONTENT_WIDTH_PX;

export interface PdfReportHeaderProps {
  logoBase64: string;
  projectName: string;
  subtitle: string;
  /** Texto ya formateado (ej. toLocaleDateString) */
  dateDisplay: string;
  /**
   * Clases del contenedor (por defecto "pdf-header").
   * Para repeticiones con saltos de página use p. ej. "pdf-header pdf-header-2".
   */
  containerClass?: string;
}

function escapeHtml(s: string): string {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * CSS del bloque de encabezado (tabla logo + título + fecha).
 * Incluir dentro de <style> del HTML del PDF junto con los estilos propios del reporte.
 */
export function getPdfReportHeaderStyles(): string {
  return `
          .pdf-header {
            width: 100%;
            margin-bottom: 20px;
            margin-top: 0;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
            box-sizing: border-box;
          }
          .pdf-header--section {
            margin-top: 0;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 10px;
          }
          .header-table td {
            vertical-align: middle;
            padding: 8px;
            border: 1px solid #ddd;
            height: 60px;
            box-sizing: border-box;
          }
          .logo-cell {
            width: 15%;
            background-color: #f8f9fa;
            text-align: center;
            border-right: 1px solid #ddd;
            padding: 0;
          }
          .logo-cell img {
            width: 70%;
            max-height: 52px;
            margin: 0 auto;
            height: auto;
            object-fit: contain;
            display: block;
          }
          .title-cell {
            width: 70%;
            text-align: center;
            background-color: #f8f9fa;
            border-right: 1px solid #ddd;
          }
          .info-cell {
            width: 15%;
            text-align: center;
            font-size: 11px;
            background-color: #f8f9fa;
          }
          .main-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c5aa0;
            margin: 0;
            line-height: 1.3;
          }
          .subtitle {
            font-size: 12px;
            color: #666;
            margin: 5px 0 0 0;
            line-height: 1.2;
          }
  `;
}

/**
 * Fragmento HTML del encabezado reutilizable.
 */
export function buildPdfReportHeaderHtml(p: PdfReportHeaderProps): string {
  const title = escapeHtml(p.projectName ?? '');
  const sub = escapeHtml(p.subtitle ?? '');
  const date = escapeHtml(p.dateDisplay ?? '');
  const wrap = (p.containerClass ?? 'pdf-header').trim();
  return `
        <div class="${wrap}">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${p.logoBase64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="main-title">${title}</div>
                <div class="subtitle">${sub}</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
                <div style="font-size: 10px;">${date}</div>
              </td>
            </tr>
          </table>
        </div>`;
}

/**
 * Estilos base recomendados para el &lt;body&gt; del HTML del PDF (render estable entre equipos).
 */
export function getPdfReportBodyBaseStyles(): string {
  return `
          body {
            font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background-color: #ffffff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: geometricPrecision;
            font-size: 14px;
          }
  `;
}

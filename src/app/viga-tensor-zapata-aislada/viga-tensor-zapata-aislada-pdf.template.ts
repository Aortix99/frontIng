/**
 * Plantilla PDF — Viga de amarre o conexión (misma línea gráfica que zapata cuadrada).
 * Ancho coherente con PDF_REPORT_CONTENT_WIDTH_PX (pdf-report-header) vía el generador.
 */

import { Injectable } from '@angular/core';
import {
  PDFTemplate,
  PDFPageOptions,
  getStandardLetterPdfPageOptions,
} from '../services/pdf-generator.service';
import { LOGO_BASE64 } from '../imgBase64/img';
import {
  buildPdfReportHeaderHtml,
  getPdfReportBodyBaseStyles,
  getPdfReportHeaderStyles,
} from '../shared/pdf-report/pdf-report-header';

export interface VigaTensorCalculationData {
  input: {
    codMunicipio: number;
    municipioLabel: string;
    barraNomen: string;
    barraArea: number;
    b: number;
    h: number;
    cargaMaxima: number;
    luzViga: number;
    fc: number;
    fy: number;
  };
  /** Respuesta completa del API */
  response: any;
  metadata: {
    projectName?: string;
    engineer?: string;
    client?: string;
    date?: Date;
    location?: string;
  };
}

function escapeHtml(s: string): string {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function numTxt(v: unknown, decimals = 6): string {
  if (v === null || v === undefined || Number.isNaN(Number(v))) {
    return '—';
  }
  return Number(v).toFixed(decimals);
}

/** Paso tipo reporte zapata / libreta: ecuación en negrita, sustitución y resultado en párrafos (sin tablas). */
function bloquePasoProcedimiento(
  numPaso: number,
  titulo: string,
  o: { formula?: string; reemplazo?: string; resultado?: number } | null | undefined,
  unidad?: string,
  decimalesResultado = 8,
): string {
  if (!o || typeof o !== 'object') {
    return '';
  }
  const f = o.formula != null ? escapeHtml(String(o.formula)) : '—';
  const rep = o.reemplazo != null ? escapeHtml(String(o.reemplazo)) : '—';
  const r =
    o.resultado != null && typeof o.resultado === 'number'
      ? numTxt(o.resultado, decimalesResultado)
      : o.resultado != null
        ? escapeHtml(String(o.resultado))
        : '—';
  const u =
    unidad != null && unidad !== ''
      ? ` <span style="font-size:13px;color:#495057;font-weight:600;">${escapeHtml(unidad)}</span>`
      : '';
  return `
        <div class="paso-matlab">
          <h4 style="margin-bottom: 10px;">Paso ${numPaso}: ${escapeHtml(titulo)}</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>${f}</strong></p>
            <p style="margin: 5px 0;">${rep}</p>
            <p style="margin: 5px 0;">= <strong>${r}</strong>${u}</p>
          </div>
        </div>`;
}

@Injectable({
  providedIn: 'root',
})
export class VigaTensorZapataAisladaPDFTemplate implements PDFTemplate {
  generateHeaderHtml(data: VigaTensorCalculationData): string {
    const currentDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return buildPdfReportHeaderHtml({
      logoBase64: LOGO_BASE64,
      projectName: data.metadata.projectName ?? '',
      subtitle:
        'Reporte de cálculo — Viga de amarre o conexión · NSR-10 / modelo interno',
      dateDisplay: currentDate,
      containerClass: 'pdf-header',
    });
  }

  generateContent(data: VigaTensorCalculationData): string {
    const res = data.response;
    const err = res?.error === true;
    const rs = res?.registroSismico;

    const tituloDesarrolloNsr = !err
      ? `<p class="desarrollo-titulo-nsr">C.15.13 Diseño de viga de amarre (NSR-10)</p>`
      : '';

    const unidadPaso12 =
      !err &&
      res?.paso12?.resultado != null &&
      typeof res.paso12.resultado === 'number'
        ? `m → E @ ${numTxt(res.paso12.resultado * 100, 0)} cm`
        : 'm';

    const pasos = !err
      ? [
          bloquePasoProcedimiento(1, 'Carga axial máxima (tabla B.2.3)', res?.axialMaxima, 'tonf'),
          bloquePasoProcedimiento(2, 'Carga última', res?.cargaUltima, 'tonf'),
          bloquePasoProcedimiento(3, 'Área bruta de concreto ag = b × h', res?.ag, 'm²'),
          bloquePasoProcedimiento(4, 'Acero (ρ × b×100 × h×100)', res?.Acero, 'cm²'),
          bloquePasoProcedimiento(
            5,
            'Número efectivo de barras (Acero / área barra)',
            res?.Acero1,
          ),
          bloquePasoProcedimiento(6, 'Área de acero (Acero1 × BarraViga)', res?.acero2, 'cm²'),
          bloquePasoProcedimiento(7, 'Área total refuerzo (acero2 × 2)', res?.acero3, 'cm²'),
          bloquePasoProcedimiento(8, 'Ast (área de acero longitudinal)', res?.Ast, 'm²'),
          bloquePasoProcedimiento(9, 'ϕPn máxima (compresión)', res?.PhiPnMaxima, 'MN'),
          bloquePasoProcedimiento(10, 'ϕPn', res?.PhiPn, 'tonf'),
          bloquePasoProcedimiento(11, 'ϕTu (tracción)', res?.PhiTu, 'tonf'),
          bloquePasoProcedimiento(
            12,
            'Separación de estribos (C.15.13.4)',
            res?.paso12,
            unidadPaso12,
            2,
          ),
        ].join('')
      : '';

    const verificacionesHtml =
      !err && res?.cargaUltima && res?.PhiPn && res?.PhiTu
        ? `
        <div class="section-result">
          <h3 class="section-header">✅ Verificaciones</h3>
          <div class="section-content">
            <ul class="validation-list">
              <li class="validation-item">
                <div class="validation-item-inner">
                  <div class="validation-title">Chequeo a compresión</div>
                  <div class="validation-detail">
                    <strong>Condición:</strong> ϕPn ≥ carga última →
                    ${numTxt(res.PhiPn.resultado, 4)} ≥ ${numTxt(res.cargaUltima.resultado, 4)}
                    <span class="success-icon">✓ CUMPLE</span>
                  </div>
                </div>
              </li>
              <li class="validation-item">
                <div class="validation-item-inner">
                  <div class="validation-title">Chequeo a tracción</div>
                  <div class="validation-detail">
                    <strong>Condición:</strong> ϕTu ≥ carga última →
                    ${numTxt(res.PhiTu.resultado, 4)} ≥ ${numTxt(res.cargaUltima.resultado, 4)}
                    <span class="success-icon">✓ CUMPLE</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>`
        : '';

    const resumenPaso5Recuadro =
      !err && res?.Acero1?.reemplazo != null
        ? `
            <div class="resumen-paso5-recuadro">
              <div class="resumen-paso5-titulo">Paso 5 — Número efectivo de barras (Acero / área barra)</div>
              <div class="resumen-paso5-detalle">${escapeHtml(String(res.Acero1.reemplazo))}</div>
            </div>`
        : '';

    const resumenHtml =
      !err && res
        ? `
        <div class="section">
          <h3 class="section-header">Resumen de resultados</h3>
          <div class="section-content">
            <div class="input-grid">
              <div class="input-item">
                <div class="input-label">ρ adoptado</div>
                <div class="input-value">${res.rho != null ? numTxt(res.rho, 6) : '—'}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Separacion de estribos</div>
                <div class="input-value">${res.paso12?.resultado != null ? `E @ ${numTxt(res.paso12.resultado, 2)} m (${numTxt(res.paso12.resultado * 100, 0)} cm)` : '—'}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Carga última</div>
                <div class="input-value">${res.cargaUltima?.resultado != null ? numTxt(res.cargaUltima.resultado, 4) : '—'}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Acero superior</div>
                <div class="input-value">${res.Acero1?.resultado != null ? numTxt(res.Acero1.resultado, 4) : '—'}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Acero inferior</div>
                <div class="input-value">${res.Acero1?.resultado != null ? numTxt(res.Acero1.resultado, 4) : '—'}</div>
              </div>
            </div>
          </div>
        </div>`
        : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${getPdfReportBodyBaseStyles()}
          ${getPdfReportHeaderStyles()}
          .section {
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 16px;
            border: 1px solid #dee2e6;
          }
          .section-header {
            background-color: #2c5aa0;
            color: white;
            padding: 10px 13px;
            margin: 0;
            font-size: 15px;
            font-weight: bold;
          }
          /* Sin franja azul: encabezado tipo texto (procedimiento / libreta) */
          .section-header-plain {
            background: none;
            color: #333;
            padding: 10px 12px 12px 12px;
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #dee2e6;
          }
          .section-content { padding: 12px; }
          .desarrollo-titulo-nsr {
            margin: 0 0 16px 0;
            padding: 0;
            font-size: 15px;
            font-weight: bold;
            color: #2c5aa0;
          }
          /* SpringGreen: detectado al paginar; no se pinta en el PDF (se omite al armar páginas) */
          .pdf-body-slice-break-marker {
            height: 2px;
            margin: 0;
            padding: 0;
            border: none;
            width: 100%;
            background: #00ff7f;
          }
          /* Evita barra azul sola al final de página y cortes en blanco bajo el título (pdf-generator.service) */
          .section-sismicos-pdf .section-content {
            background-color: #e8edf3;
            padding-top: 8px;
          }
          .input-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .input-item {
            background-color: #f8f9fa;
            padding: 8px;
            border-radius: 5px;
          }
          .input-label {
            font-weight: bold;
            color: #495057;
            font-size: 12px;
          }
          .input-value {
            font-size: 14px;
            color: #2c5aa0;
            font-weight: bold;
            margin-top: 4px;
          }
          .resumen-paso5-recuadro {
            margin: 0 0 14px 0;
            padding: 12px 14px;
            background: #f8f9fa;
            border: 1px solid #ced4da;
            border-radius: 8px;
            border-left: 4px solid #2c5aa0;
          }
          .resumen-paso5-titulo {
            font-weight: bold;
            color: #495057;
            font-size: 12px;
            margin: 0 0 8px 0;
            text-transform: none;
          }
          .resumen-paso5-detalle {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            color: #212529;
            line-height: 1.4;
            margin: 0;
          }
          .alert-box {
            background: ${err ? '#f8d7da' : '#d4edda'};
            border: 1px solid ${err ? '#f5c6cb' : '#c3e6cb'};
            color: ${err ? '#721c24' : '#155724'};
            padding: 14px;
            border-radius: 8px;
            margin-bottom: 16px;
          }
          .paso-matlab {
            page-break-inside: avoid;
            margin-bottom: 18px;
          }
          .paso-matlab h4 {
            color: #2c5aa0;
            font-size: 15px;
            font-weight: bold;
          }
          .rho-prose {
            font-family: 'Times New Roman', serif;
            line-height: 1.2;
            margin: 12px 0 8px;
            padding: 12px;
            background: #f8f9fa;
            border-left: 4px solid #2c5aa0;
            border-radius: 0 8px 8px 0;
          }
          .section-result {
            margin-top: 16px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #dee2e6;
          }
          .validation-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .validation-item {
            margin: 0 0 22px 0;
            padding: 0;
            list-style: none;
            background: transparent;
            border: none;
          }
          .validation-item-inner {
            background-color: #d4edda;
            border-radius: 5px;
            padding: 12px 12px 14px 12px;
            border-left: 4px solid #28a745;
          }
          .validation-title {
            font-weight: bold;
            color: #155724;
            margin: 0 0 6px 0;
            font-size: 16px;
          }
          .validation-detail {
            color: #155724;
            font-size: 14px;
            margin: 5px 0;
          }
          .success-icon {
            color: #28a745;
            font-weight: bold;
            margin-left: 10px;
          }
          .signature-section {
            margin-top: 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .signature-box {
            text-align: center;
            border-top: 2px solid #2c5aa0;
            padding-top: 10px;
          }
          .signature-label { font-weight: bold; color: #2c5aa0; }
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            color: #6c757d;
            font-size: 12px;
          }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="section">
          <h3 class="section-header">📊 Datos de entrada</h3>
          <div class="section-content">
            <div class="input-grid">
              <div class="input-item">
                <div class="input-label">Ubicación (DANE)</div>
                <div class="input-value">${escapeHtml(data.input.municipioLabel)}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Código municipio</div>
                <div class="input-value">${data.input.codMunicipio}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Barra longitudinal</div>
                <div class="input-value">Ø ${escapeHtml(data.input.barraNomen)} (${data.input.barraArea} cm²)</div>
              </div>
              <div class="input-item">
                <div class="input-label">b (m)</div>
                <div class="input-value">${data.input.b}</div>
              </div>
              <div class="input-item">
                <div class="input-label">h (m)</div>
                <div class="input-value">${data.input.h}</div>
              </div>
              <div class="input-item">
                <div class="input-label">Carga máxima</div>
                <div class="input-value">${data.input.cargaMaxima} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">Luz de viga (m)</div>
                <div class="input-value">${data.input.luzViga}</div>
              </div>
              <div class="input-item">
                <div class="input-label">f'c mpa</div>
                <div class="input-value">${data.input.fc}</div>
              </div>
              <div class="input-item">
                <div class="input-label">fy mpa</div>
                <div class="input-value">${data.input.fy}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 0 0 400px; margin-top: 0px">
        <img
          src="assets/img/vigaAmarre.png"
          alt="Logo DEINERSITO"
          style="width: 100%; height: auto; border-radius: 10px"
        />
      </div>
        ${
          err
            ? `<div class="alert-box"><strong>Estado del cálculo:</strong> ${escapeHtml(String(res?.message ?? 'No cumple.'))}</div>`
            : ''
        }

        ${
          !err && rs
            ? `
        <!-- Franja #00ff7f: forzar salto de página antes de coeficientes (misma lógica que verificaciones) -->
        <div class="pdf-body-slice-break-marker" aria-hidden="true"></div>
        <div class="section section-sismicos-pdf">
          <h3 class="section-header">Coeficientes sísmicos (municipio)</h3>
          <div class="section-content">
            <div class="input-grid">
              <div class="input-item"><div class="input-label">Departamento</div><div class="input-value">${escapeHtml(String(rs.departamento ?? '—'))}</div></div>
              <div class="input-item"><div class="input-label">Municipio</div><div class="input-value">${escapeHtml(String(rs.municipio ?? '—'))}</div></div>
              <div class="input-item"><div class="input-label">Aa</div><div class="input-value">${numTxt(rs.aa, 4)}</div></div>
              <div class="input-item"><div class="input-label">Av</div><div class="input-value">${rs.av != null ? numTxt(rs.av, 4) : '—'}</div></div>
              <div class="input-item"><div class="input-label">ZAS</div><div class="input-value">${escapeHtml(String(rs.zas ?? '—'))}</div></div>
              <div class="input-item"><div class="input-label">Ae / Ad</div><div class="input-value">${numTxt(rs.ae, 4)} / ${numTxt(rs.ad, 4)}</div></div>
            </div>
          </div>
        </div>`
            : ''
        }

        ${
          !err && res?.rho != null
            ? `<div class="rho-prose"><p style="margin: 0;"><strong>ρ adoptado</strong> (cuantía de refuerzo, iteración del modelo): ${numTxt(res.rho, 6)}</p></div>`
            : ''
        }

        ${
          !err
            ? `
        <div class="section">
          <h3 class="section-header-plain">Desarrollo del cálculo</h3>
          <div class="section-content">
            ${tituloDesarrolloNsr}
            ${pasos}
          </div>
        </div>
        <!-- Franja #00ff7f: corte PDF antes de resultados (pdf-generator.service) -->
        <div class="pdf-body-slice-break-marker" aria-hidden="true"></div>
        ${verificacionesHtml}
        ${resumenHtml}`
            : ''
        }

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Calculado por:</div>
          </div>
          <div class="signature-box">
            <div class="signature-label">Revisado por:</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>SS INGENIERIA</strong> | Potenciado por System Structur</p>
          <p>Reporte generado automáticamente. El ingeniero responsable debe validar los resultados según la NSR-10 / ACI 318.</p>
          <p>Soporte y Ventas: <strong>(+57) 3023631005</strong> • Acceso Web: <strong>front-ing.vercel.app</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  getFileName(data: VigaTensorCalculationData): string {
    const projectName = data.metadata?.projectName || 'Viga_amarre_o_conexion';
    const timestamp = new Date().toISOString().slice(0, 16).replaceAll(/[:-]/g, '');
    return `${projectName.trim()}_${timestamp}.pdf`;
  }

  getPageOptions(): PDFPageOptions {
    return getStandardLetterPdfPageOptions();
  }
}

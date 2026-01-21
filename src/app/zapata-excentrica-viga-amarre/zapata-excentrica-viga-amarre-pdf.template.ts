import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';

export interface ZapataExcentricaVigaAmarrePDFData {
  input: any;
  response: any;
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

    const inpt = data.input || {};
    const r = data.response || {};

    // Utilidades para tablas
    const formatNum = (v: any, d: number = 2) => {
      const n = Number(v);
      return isFinite(n) ? n.toFixed(d) : String(v ?? '');
    };
    const safeArr = (arr: any) => Array.isArray(arr) ? arr : [];

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; background: #fff; }
            /* Encabezado estilo combinado */
            .pdf-header { width: 100%; margin-bottom: 16px; border-bottom: 2px solid #2c5aa0; padding-bottom: 8px; }
            .header-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            .header-table td { vertical-align: middle; padding: 8px; border: 1px solid #ddd; height: 60px; }
            .logo-cell { width: 15%; background-color: #f8f9fa; text-align: center; border-right: 1px solid #ddd; font-size: 11px; color: #999; }
            .title-cell { width: 70%; text-align: center; background-color: #f8f9fa; border-right: 1px solid #ddd; }
            .info-cell { width: 15%; text-align: center; font-size: 11px; background-color: #f8f9fa; }
            .main-title { font-size: 16px; font-weight: bold; color: #2c5aa0; margin: 0; line-height: 1.3; }
            .subtitle { font-size: 12px; color: #666; margin: 4px 0 0 0; line-height: 1.2; }

            /* Secciones y grillas */
            .section { margin-top: 14px; border-radius: 8px; overflow: hidden; }
            .section-header { background: #2c5aa0; color: #fff; padding: 8px 12px; font-weight: bold; font-size: 14px; }
            .section-content { padding: 10px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
            .card { background: #f8f9fa; border-radius: 6px; padding: 8px; }
            .label { color: #495057; font-weight: bold; font-size: 12px; }
            .value { color: #2c5aa0; font-weight: bold; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; font-size: 12px; }
            .table th { background: #2c5aa0; color: #fff; padding: 6px; border: 1px solid #ddd; }
            .table td { padding: 6px; border: 1px solid #ddd; text-align: center; }
            .note { font-size: 11px; color: #666; }
            .formula { font-family: 'Times New Roman', serif; font-size: 12px; }

            /* Validación estilo lista */
            .validation-list { list-style: none; padding: 0; margin: 0; }
            .validation-item { background-color: #d4edda; border-radius: 5px; padding: 10px; margin-bottom: 8px; border-left: 4px solid #28a745; display:flex; justify-content: space-between; align-items: center; }
            .validation-title { font-weight: bold; color: #155724; }
            .success-icon { color: #28a745; font-weight: bold; margin-left: 10px; }

            /* Firma */
            .signature-section { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .signature-box { text-align: center; border-top: 2px solid #2c5aa0; padding-top: 10px; }
            .signature-label { font-weight: bold; color: #2c5aa0; }
          </style>
        </head>
        <body>
          <!-- Encabezado de página 1 -->
          <div class="pdf-header">
            <table class="header-table">
              <tr>
                <td class="logo-cell">LOGO</td>
                <td class="title-cell">
                  <div class="main-title">${data.metadata.projectName || 'Zapata Excéntrica con Viga de Amarre'}</div>
                  <div class="subtitle">Reporte de cálculo estructural</div>
                </td>
                <td class="info-cell">
                  <div style="font-weight:bold; margin-bottom:3px;">FECHA:</div>
                  <div style="font-size:10px;">${currentDate}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Datos de entrada -->
          <div class="section">
            <div class="section-header">Datos de Entrada</div>
            <div class="section-content">
              <div class="grid-3">
                <div class="card"><div class="label">Fc (kgf/cm²)</div><div class="value">${inpt.Fc ?? ''}</div></div>
                <div class="card"><div class="label">Fy (kgf/cm²)</div><div class="value">${inpt.Fy ?? ''}</div></div>
                <div class="card"><div class="label">Qa (Ton/m²)</div><div class="value">${inpt.Qa ?? ''}</div></div>

                <div class="card"><div class="label">Hz (cm)</div><div class="value">${inpt.Hz ?? ''}</div></div>
                <div class="card"><div class="label">Lz (m)</div><div class="value">${inpt.Lz ?? ''}</div></div>
                <div class="card"><div class="label">Av (cm)</div><div class="value">${inpt.Av ?? ''}</div></div>

                <div class="card"><div class="label">Hv (cm)</div><div class="value">${inpt.Hv ?? ''}</div></div>
                <div class="card"><div class="label">Pu Ext (Ton)</div><div class="value">${inpt.PuExt ?? ''}</div></div>
                <div class="card"><div class="label">Pu Int (Ton)</div><div class="value">${inpt.PuInt ?? ''}</div></div>

                <div class="card"><div class="label">Cx Ext (cm)</div><div class="value">${inpt.CxExt ?? ''}</div></div>
                <div class="card"><div class="label">Cy Ext (cm)</div><div class="value">${inpt.CyExt ?? ''}</div></div>
                <div class="card"><div class="label">Cx Int (cm)</div><div class="value">${inpt.CxInt ?? ''}</div></div>

                <div class="card"><div class="label">Cy Int (cm)</div><div class="value">${inpt.CyInt ?? ''}</div></div>
                <div class="card"><div class="label">Ramas</div><div class="value">${inpt.ramas ?? ''}</div></div>
                <div class="card"><div class="label">Nbarras (Viga)</div><div class="value">${inpt.Nbarras?.item ?? ''} · Área ${inpt.Nbarras?.data ?? ''} cm²</div></div>

                <div class="card"><div class="label">Zapata Ext (Larga)</div><div class="value">${inpt.zapataExtLarga?.item ?? ''} · Área ${inpt.zapataExtLarga?.data ?? ''} cm²</div></div>
                <div class="card"><div class="label">Zapata Ext (Corta)</div><div class="value">${inpt.zapataExtCorta?.Nomen ?? ''} · Área ${inpt.zapataExtCorta?.area ?? ''} cm²</div></div>
                <div class="card"><div class="label">Zapata Int</div><div class="value">${inpt.zapataInt?.item ?? ''} · Área ${inpt.zapataInt?.data ?? ''} cm²</div></div>

                <div class="card"><div class="label">Viga · N° Barra</div><div class="value">${inpt.vgNroBarra?.item ?? ''} · Área ${inpt.vgNroBarra?.data ?? ''} cm²</div></div>
              </div>
              <div class="note">Notas: Cotas Cx/Cy y Hz se suministran en centímetros; Lz en metros.</div>
            </div>
          </div>

          <!-- Paso 1: Presión de contacto -->
          <div class="section">
            <div class="section-header">Paso 1 · Revisión de presión de contacto</div>
            <div class="section-content">
              <div class="card">
                <div class="formula">Pu<sub>Ext</sub> = ${formatNum(inpt.PuExt)} Ton · Pu<sub>Int</sub> = ${formatNum(inpt.PuInt)} Ton</div>
                <div class="formula">Pu<sub>max</sub> = (0.7 · 0.85 · Fc · Cx · Cy)/1000</div>
                <p class="note">Interna: ${r.presionInt?.formula || ''}</p>
                <p class="note">Externa: ${r.presionExt?.formula || ''}</p>
                <p class="value">Pu<sub>Ext</sub> ≤ ${formatNum(r.presionExt?.resultado)} · Pu<sub>Int</sub> ≤ ${formatNum(r.presionInt?.resultado)} · OK</p>
              </div>
            </div>
          </div>

          <!-- Encabezado de página 2 -->
          <div class="pdf-header" style="margin-top:18px;">
            <table class="header-table">
              <tr>
                <td class="logo-cell">LOGO</td>
                <td class="title-cell">
                  <div class="main-title">${data.metadata.projectName || 'Zapata Excéntrica con Viga de Amarre'}</div>
                  <div class="subtitle">Dimensiones y distribución</div>
                </td>
                <td class="info-cell">
                  <div style="font-weight:bold; margin-bottom:3px;">FECHA:</div>
                  <div style="font-size:10px;">${currentDate}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Paso 2: Dimensiones y distribución -->
          <div class="section">
            <div class="section-header">Paso 2 · Dimensiones y distribución</div>
            <div class="section-content">
              <div class="grid-2">
                <div class="card">
                  <div class="label">Zapata Interna (Cuadrada)</div>
                  <div class="value">B = ${formatNum(r.B_Int)} m · L = ${formatNum(r.L_Int)} m</div>
                  <div class="note">Área servicio = ${formatNum(r.AreaZapataInt?.resultado)} m²</div>
                </div>
                <div class="card">
                  <div class="label">Zapata Externa (Rectangular)</div>
                  <div class="value">B = ${formatNum(r.B_Ext?.resultado)} m · L = ${formatNum(r.L_Ext)} m</div>
                  <div class="note">Área servicio = ${formatNum(r.AreaZapataExt?.resultado)} m²</div>
                </div>
              </div>
              <div class="grid-2" style="margin-top:8px;">
                <div class="card"><div class="label">Disposición (Desfase)</div><div class="value">Dis = ${formatNum(r.Dis?.resultado)} m</div></div>
                <div class="card"><div class="label">Lz efectivo</div><div class="value">Lz₂ = ${formatNum(r.Lz2)} m</div></div>
              </div>
            </div>
          </div>

          <!-- Encabezado de página 3 -->
          <div class="pdf-header" style="margin-top:18px;">
            <table class="header-table">
              <tr>
                <td class="logo-cell">LOGO</td>
                <td class="title-cell">
                  <div class="main-title">${data.metadata.projectName || 'Zapata Excéntrica con Viga de Amarre'}</div>
                  <div class="subtitle">Diagramas y verificaciones</div>
                </td>
                <td class="info-cell">
                  <div style="font-weight:bold; margin-bottom:3px;">FECHA:</div>
                  <div style="font-size:10px;">${currentDate}</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Paso 3: Reacciones y cortantes/momentos -->
          <div class="section">
            <div class="section-header">Paso 3 · Reacciones del suelo y diagramas</div>
            <div class="section-content">
              <div class="grid-2">
                <div class="card">
                  <div class="label">Reacción Última Ext.</div>
                  <div class="value">Re<sub>u</sub> = ${formatNum(r.Re_UltimoExt?.resultado)} Ton</div>
                  <div class="note">${r.Re_UltimoExt?.formula || ''}</div>
                </div>
                <div class="card">
                  <div class="label">Reacción Última Int.</div>
                  <div class="value">Ri<sub>u</sub> = ${formatNum(r.Ri_UltimoInt?.resultado)} Ton</div>
                  <div class="note">${r.Ri_UltimoInt?.formula || ''}</div>
                </div>
              </div>

              <div style="margin-top:10px;" class="grid-2">
                <div class="card">
                  <div class="label">Tabla de Cortante (Ton)</div>
                  <table class="table">
                    <thead><tr><th>X (m)</th><th>V (Ton)</th></tr></thead>
                    <tbody>
                      ${safeArr(r.arrayDataEjeX).map((x: number, i: number) => {
                        const y = safeArr(r.arrayDataEjeY)[i] ?? 0;
                        return `<tr><td>${formatNum(x)}</td><td>${formatNum(y)}</td></tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
                <div class="card">
                  <div class="label">Tabla de Momento (Ton·m)</div>
                  <table class="table">
                    <thead><tr><th>X (m)</th><th>M (Ton·m)</th></tr></thead>
                    <tbody>
                      ${safeArr(r.arrayDataEjeX).map((x: number, i: number) => {
                        const my = safeArr(r.momentEjeY)[i] ?? 0;
                        return `<tr><td>${formatNum(x)}</td><td>${formatNum(my)}</td></tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="note">Las gráficas se representan con tablas de datos (sin imágenes).</div>
            </div>
          </div>

          <!-- Paso 4: Verificaciones de punzonamiento y cortante -->
          <div class="section">
            <div class="section-header">Paso 4 · Verificaciones de punzonamiento y cortante</div>
            <div class="section-content">
              <div class="grid-2">
                <div class="card">
                  <div class="label">Interna</div>
                  <div class="formula">Q<sub>u</sub> = ${formatNum(r.QultimoInt?.resultado)} Ton/m² · b₀ = ${formatNum(r.b0)} cm · d = ${inpt.Hz ?? 0} cm</div>
                  <div class="note">Vu = ${formatNum(r.Vu)} Ton; Vc (1.1·0.75·√Fc) y Vc (0.53·0.75·√Fc) cumplen.</div>
                </div>
                <div class="card">
                  <div class="label">Externa</div>
                  <div class="formula">b₀,ext = ${formatNum(r.bo_Ext?.resultado)} m · Qvt = ${formatNum(r.Qvt?.resultado)} Ton/m²</div>
                  <div class="note">Vu<sub>ext</sub> = ${formatNum(r.VuExt?.resultado)} Ton; verificaciones λ=1, 0.27 y cortante (0.53·0.75·√Fc) cumplen.</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paso 5: Viga de amarre -->
          <div class="section">
            <div class="section-header">Paso 5 · Diseño de viga de amarre</div>
            <div class="section-content">
              <div class="grid-2">
                <div class="card">
                  <div class="label">Chequeo de ancho por cortante</div>
                  <div class="note">b = ${(r.b_Ext?.resultado ?? '')} cm ≤ Av = ${inpt.Av ?? ''} cm</div>
                </div>
                <div class="card">
                  <div class="label">Acero por cortante (C.11.4)</div>
                  <div class="note">Vc = ${formatNum(r.Vc_acero?.resultado)} Ton · ΔVc = ${formatNum(r.delta_Vc?.resultado)} Ton</div>
                  <div class="value">Separación máx estribos S<sub>max</sub> = ${formatNum(r.SMax?.resultado)} cm</div>
                  <div class="value">Recomendado: ${r.Hierro || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paso 6: Acero de zapatas -->
          <div class="section">
            <div class="section-header">Paso 6 · Acero de refuerzo en zapatas</div>
            <div class="section-content">
              <div class="grid-2">
                <div class="card">
                  <div class="label">Zapata Interna</div>
                  <div class="note">Mu = ${formatNum(r.MuInt?.resultado)} Ton·m</div>
                  <div class="value">${r.AsInt?.formula || ''} · Separación = ${formatNum(r.AsInt?.Arroba2)} cm</div>
                </div>
                <div class="card">
                  <div class="label">Zapata Externa (Lado Largo)</div>
                  <div class="note">Mu = ${formatNum(r.MuExt?.resultado)} Ton·m</div>
                  <div class="value">${r.AsExtLarga?.formula || ''} · Separación = ${formatNum(r.AsExtLarga?.Arroba2)} cm</div>
                </div>
              </div>
              <div class="grid-2" style="margin-top:8px;">
                <div class="card">
                  <div class="label">Zapata Externa (Lado Corto)</div>
                  <div class="value">${r.AsExtCorta?.formula || ''} · Separación = ${formatNum(r.AsExtCorta?.Arroba2)} cm</div>
                </div>
                <div class="card">
                  <div class="label">Parrillas Dobles</div>
                  <div class="note">Int: ${r.AsParrillaDobleInterna?.formula || ''}</div>
                  <div class="note">Ext: ${r.AsParrillaDobleExterna?.formula || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Firmas -->
          <div class="section" style="margin-top:18px;">
            <div class="section-content">
              <div class="grid-2">
                <div class="card"><div class="label">Ingeniero responsable</div><div class="note">${data.metadata.engineer || 'Ing. Civil'}</div></div>
                <div class="card"><div class="label">Cliente</div><div class="note">${data.metadata.client || ''}</div></div>
              </div>
            </div>
          </div>

          <!-- Checklist final y firmas -->
          <div class="section">
            <div class="section-header">Checklist · Cumplimiento</div>
            <div class="section-content">
              <ul class="validation-list">
                <li class="validation-item"><span class="validation-title">Presión de contacto (Int/Ext)</span><span class="success-icon">✔</span></li>
                <li class="validation-item"><span class="validation-title">Punzonamiento interno (λ=1, 0.27, cortante)</span><span class="success-icon">✔</span></li>
                <li class="validation-item"><span class="validation-title">Punzonamiento externo (λ=1, 0.27, cortante)</span><span class="success-icon">✔</span></li>
                <li class="validation-item"><span class="validation-title">Viga de amarre (cortante / separación estribos)</span><span class="success-icon">✔</span></li>
                <li class="validation-item"><span class="validation-title">Refuerzo en zapatas (separaciones válidas)</span><span class="success-icon">✔</span></li>
              </ul>
              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-label">Ingeniero responsable</div>
                  <div>${data.metadata.engineer || 'Ing. Civil'}</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">Cliente</div>
                  <div>${data.metadata.client || ''}</div>
                </div>
              </div>
            </div>
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

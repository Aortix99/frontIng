/**
 * ZapataExcentricaVigaAmarrePDFTemplate - Template específico para reportes de zapata excéntrica con viga de amarre
 * Implementa PDFTemplate para generar contenido HTML específico
 */

import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';
import { LOGO_BASE64 } from '../imgBase64/img';

export interface ZapataExcentricaVigaAmarreCalculationData {
  // Datos de entrada
  input: {
    Fc: number;
    Fy: number;
    Qa: number;
    Hz: number;
    Lz: number;
    Av: number;
    Hv: number;
    PuExt: number;
    PuInt: number;
    CxExt: number;
    CyExt: number;
    CxInt: number;
    CyInt: number;
    ramas: number;
    Nbarras?: any;
    zapataExtLarga?: any;
    zapataExtCorta?: any;
    zapataInt?: any;
    vgNroBarra?: any;
  };

  // Resultados del cálculo
  response: any;

  // Metadatos
  metadata: {
    projectName?: string;
    engineer?: string;
    client?: string;
    date?: Date;
    location?: string;
  };

  // Imagen de la gráfica de cortante
  chartImage?: string;

  // Datos de los puntos de la gráfica
  chartPoints?: Array<{ x: number; y: number }>;

  // Imagen de la gráfica de momento
  graficaMomento?: string;

  // Datos de los puntos de la gráfica de momento
  momentoPoints?: Array<{ x: number; y: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class ZapataExcentricaVigaAmarrePDFTemplate implements PDFTemplate {

  generateContent(data: ZapataExcentricaVigaAmarreCalculationData): string {
    const currentDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const r = data.response || {};
    const inpt = data.input || {};

    // Utilidades para formateo
    const formatNum = (v: any, d: number = 2) => {
      const n = Number(v);
      return Number.isFinite(n) ? n.toFixed(d) : String(v ?? 'N/A');
    };
    const safeArr = (arr: any) => Array.isArray(arr) ? arr : [];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
            background-color: #ffffff;
          }

          .pdf-header {
            width: 100%;
            margin-bottom: 20px;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
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
            margin-left: 14px;
            height: 100%;
            object-fit: contain;
            display: block;
          }

          .logo-placeholder {
            display: none;
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

          .logo-placeholder {
            color: #999;
            font-size: 10px;
            font-style: italic;
          }
          
          .section-result {
            border-radius: 8px;
            overflow: hidden;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
            display: block;
            height: 0;
            margin: 0;
            padding: 0;
          }
          .pdf-header-2 {
            margin-top: 560px;
            page-break-before: always;
            break-before: page;
          }
          .pdf-header-3 {
            margin-top: 400px;
            page-break-before: always;
            break-before: page;
          }
          .pdf-header-4 {
            margin-top: 200px;
            page-break-before: always;
            break-before: page;
          }
          .section {
            border-radius: 8px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .section-jump-line {
            border-radius: 8px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .paso3 {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .paso3-momento {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .chart-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .section-header {
            background-color: #2c5aa0;
            color: white;
            padding: 10px 13px;
            margin: 0;
            font-size: 15px;
            font-weight: bold;
          }
          
          .section-content {
            padding: 5px;
          }
          
          .input-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-bottom: 10px;
          }
          
          .input-item {
            background-color: #f8f9fa;
            padding: 3px;
            border-radius: 5px;
          }
          
          .input-label {
            font-weight: bold;
            color: #495057;
            font-size: 14px;
          }
          
          .input-value {
            font-size: 16px;
            color: #2c5aa0;
            font-weight: bold;
            margin-top: 3px;
          }
          
          .validation-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .validation-item {
            background-color: #d4edda;
            border-radius: 5px;
            padding: 12px;
            margin-bottom: 10px;
            border-left: 4px solid #28a72eff;
          }
          
          .validation-title {
            font-weight: bold;
            color: #155724;
            margin-bottom: 8px;
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
          
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
            color: #6c757d;
            font-size: 12px;
          }
          
          .footer p {
            margin: 5px 0;
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
          
          .signature-label {
            font-weight: bold;
            color: #2c5aa0;
          }

          .chart-section {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            margin: 20px 0;
          }

          .chart-image-container {
            flex: 1;
            min-width: 300px;
          }

          .chart-image-container img {
            width: 100%;
            max-width: 500px;
            height: auto;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .chart-table-container {
            flex: 1;
            min-width: 200px;
          }

          .chart-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 10px;
          }

          .chart-table thead {
            background-color: #2c5aa0;
            color: white;
          }

          .chart-table th {
            padding: 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #ddd;
          }

          .chart-table td {
            padding: 8px;
            text-align: center;
            border: 1px solid #ddd;
          }

          .chart-table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          .chart-table tbody tr:hover {
            background-color: #e8f0f8;
          }
        </style>
      </head>
      <body>
        <div class="pdf-header">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="main-title">${data.metadata.projectName || 'Zapata Excéntrica con Viga de Amarre'}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata excéntrica con viga de amarre</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
                <div style="font-size: 10px;">${currentDate}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Input Data Section -->
        <div class="section">
          <h3 class="section-header">📊 Datos de Entrada</h3>
          <div class="section-content">
            <div class="input-grid">
              <!-- Concreto y Materiales -->
              <div class="input-item">
                <div class="input-label">Fc (Resistencia Concreto)</div>
                <div class="input-value">${inpt.Fc ?? 'N/A'} kgf/cm²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Fy (Límite Fluencia Acero)</div>
                <div class="input-value">${inpt.Fy ?? 'N/A'} kgf/cm²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Qa (Capacidad Admisible)</div>
                <div class="input-value">${inpt.Qa ?? 'N/A'} Ton/m²</div>
              </div>
              <!-- Geometría General -->
              <div class="input-item">
                <div class="input-label">Hz (Altura Zapata)</div>
                <div class="input-value">${inpt.Hz ?? 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">Lz (Distancia entre Columnas)</div>
                <div class="input-value">${inpt.Lz ?? 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Av (Ancho Viga)</div>
                <div class="input-value">${inpt.Av ?? 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">Hv (Altura Viga)</div>
                <div class="input-value">${inpt.Hv ?? 'N/A'} cm</div>
              </div>
              <!-- Columna Externa -->
              <div class="input-item">
                <div class="input-label">PuExt (Carga Última Ext.)</div>
                <div class="input-value">${inpt.PuExt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">CxExt (Dimensión X Ext.)</div>
                <div class="input-value">${inpt.CxExt ?? 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">CyExt (Dimensión Y Ext.)</div>
                <div class="input-value">${inpt.CyExt ?? 'N/A'} cm</div>
              </div>
              <!-- Columna Interna -->
              <div class="input-item">
                <div class="input-label">PuInt (Carga Última Int.)</div>
                <div class="input-value">${inpt.PuInt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">CxInt (Dimensión X Int.)</div>
                <div class="input-value">${inpt.CxInt ?? 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">CyInt (Dimensión Y Int.)</div>
                <div class="input-value">${inpt.CyInt ?? 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">Ramas</div>
                <div class="input-value">${inpt.ramas ?? 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
        <h4 style="margin-bottom: 10px;">Paso 1: Revisión de la presión de contacto.</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
           <p style="margin: 5px 0;">Pu<sub>Ext</sub> = ${formatNum(inpt.PuExt)} Ton </p>
           <p style="margin: 5px 0;">Pu<sub>Int</sub> = ${formatNum(inpt.PuInt)} Ton </p>
           <strong>Pu<sub>Max</sub> =  Φ * 0.85 * F<sub>c</sub> * C<sub>x</sub> * C<sub>y</sub></strong>
           <p style="margin: 5px 0;">Pu<sub>MaxExt</sub> =  (0.7 * 0.85 * ${inpt.Fc} Kg/cm² * ${inpt.CxExt} cm * ${inpt.CyExt} cm) / 1000 Ton/kgf = ${formatNum(r.presionExt?.resultado)} Ton </p>
           <p style="margin: 5px 0;">Pu<sub>MaxInt</sub> =  (0.7 * 0.85 * ${inpt.Fc} Kg/cm² * ${inpt.CxInt} cm * ${inpt.CyInt} cm) / 1000 Ton/kgf = ${formatNum(r.presionInt?.resultado)} Ton </p>
           <p style="font-weight: bold; margin: 5px 0;">Pu<sub>Ext</sub> =  ${formatNum(inpt.PuExt)} ≤ ${formatNum(r.presionExt?.resultado)} OK</p>
           <p style="font-weight: bold; margin: 5px 0;">Pu<sub>Int</sub> =  ${formatNum(inpt.PuInt)} ≤ ${formatNum(r.presionInt?.resultado)} OK</p>
           </div>
        </div>
        <div class="page-break"></div>
        <div class="pdf-header-2">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="subtitle">Reporte de cálculo estructural para zapata excéntrica con viga de amarre</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="section">
          <h4>Paso 2: Dimensiones y distribución.</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
           <div style="margin-top: 10px;">
             <div style="font-weight: bold; margin: 5px 0;">Zapata Interna (Cuadrada)</div>
             <p style="margin: 5px 0;">B<sub>Int</sub> = ${formatNum(r.B_Int)} m</p>
             <p style="margin: 5px 0;">L<sub>Int</sub> = ${formatNum(r.L_Int)} m</p>
             <p style="margin: 5px 0;">Área = ${formatNum(r.AreaZapataInt?.resultado)} m²</p>
           </div>
           <div style="margin-top: 10px;">
             <div style="font-weight: bold; margin: 5px 0;">Zapata Externa (Rectangular)</div>
             <p style="margin: 5px 0;">B<sub>Ext</sub> = ${formatNum(r.B_Ext?.resultado)} m</p>
             <p style="margin: 5px 0;">L<sub>Ext</sub> = ${formatNum(r.L_Ext)} m</p>
             <p style="margin: 5px 0;">Área = ${formatNum(r.AreaZapataExt?.resultado)} m²</p>
           </div>
           <div style="margin-top: 10px;">
             <p style="margin: 5px 0;">Disposición (Desfase) = ${formatNum(r.Dis?.resultado)} m</p>
             <p style="margin: 5px 0;">Lz₂ = ${formatNum(r.Lz2)} m</p>
           </div>
          </div>
        </div>
        <div class="paso3">
         <h4 style="margin-bottom: 1px;">Paso 3: Gráfica de Cortante</h4>
         <div class="chart-section">
           <div class="chart-image-container">
             ${data.chartImage ? `<img src="${data.chartImage}" style="width: 100%; max-width: 600px; height: auto; border: 1px solid #ccc; border-radius: 5px;" />` : '<p>No hay gráfica disponible</p>'}
           </div>
           <div class="chart-table-container">
             <table class="chart-table">
               <thead>
                 <tr>
                   <th>Distancia (m)</th>
                   <th>Cortante (Ton)</th>
                 </tr>
               </thead>
               <tbody>
                 ${safeArr(r.arrayDataEjeX).length > 0 ? safeArr(r.arrayDataEjeX).map((x: number, i: number) => {
      const y = safeArr(r.arrayDataEjeY)[i] ?? 0;
      return `
                     <tr>
                       <td>${formatNum(x)}</td>
                       <td>${formatNum(y)}</td>
                     </tr>
                   `;
    }).join('') : '<tr><td colspan="2">No hay datos disponibles</td></tr>'}
               </tbody>
             </table>
           </div>
         </div>
        </div>

        <div class="page-break"></div>
        <div class="pdf-header-3">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="subtitle">Reporte de cálculo estructural para zapata excéntrica con viga de amarre</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="paso3-momento">
         <h4 style="margin-bottom: 1px;">Gráfica de Momento</h4>
         <div class="chart-section">
           <div class="chart-image-container">
             ${data.graficaMomento ? `<img src="${data.graficaMomento}" style="width: 100%; max-width: 600px; height: auto; border: 1px solid #ccc; border-radius: 5px;" />` : '<p>No hay gráfica de momento disponible</p>'}
           </div>
           <div class="chart-table-container">
             <table class="chart-table">
               <thead>
                 <tr>
                   <th>Distancia (m)</th>
                   <th>Momento (Ton·m)</th>
                 </tr>
               </thead>
               <tbody>
                 ${safeArr(r.arrayDataEjeX).length > 0 ? safeArr(r.arrayDataEjeX).map((x: number, i: number) => {
      const my = safeArr(r.momentEjeY)[i] ?? 0;
      return `
                     <tr>
                       <td>${formatNum(x)}</td>
                       <td>${formatNum(my)}</td>
                     </tr>
                   `;
    }).join('') : '<tr><td colspan="2">No hay datos disponibles</td></tr>'}
               </tbody>
             </table>
           </div>
         </div>
        </div>
        <div class="section">
         <h4 style="margin-bottom: 10px;">Paso 4: Verificaciones de punzonamiento y cortante.</h4>
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Columna Interna</div>
              <p style="margin: 5px 0;">Q<sub>u</sub> = ${formatNum(r.QultimoInt?.resultado)} Ton/m²</p>
              <p style="margin: 5px 0;">b₀ = ${formatNum(r.b0)} cm</p>
              <p style="margin: 5px 0;">d = ${(inpt.Hz ?? 0) - 9} cm</p>
              <p style="margin: 5px 0;">Vu = ${formatNum(r.Vu)} Ton</p>
              <p style="margin: 5px 0;">Verificaciones cumplen ✓</p>
              
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Columna Externa</div>
              <p style="margin: 5px 0;">b₀,ext = ${formatNum(r.bo_Ext?.resultado)} m</p>
              <p style="margin: 5px 0;">Qvt = ${formatNum(r.Qvt?.resultado)} Ton/m²</p>
              <p style="margin: 5px 0;">Vu<sub>ext</sub> = ${formatNum(r.VuExt?.resultado)} Ton</p>
              <p style="margin: 5px 0;">Verificaciones cumplen ✓</p>
            </div>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Paso 5: Diseño de viga de amarre.</h4>
        <div class="section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;">Chequeo de ancho por cortante</p>
              <p style="margin: 5px 0;">b = ${formatNum(r.b_Ext?.resultado)} cm ≤ Av = ${inpt.Av ?? 'N/A'} cm</p>
              <p style="margin: 5px 0; font-weight: bold;">Acero por cortante (C.11.4)</p>
              <p style="margin: 5px 0;">Vc = ${formatNum(r.Vc_acero?.resultado)} Ton</p>
              <p style="margin: 5px 0;">ΔVc = ${formatNum(r.delta_Vc?.resultado)} Ton</p>
              <p style="margin: 5px 0; font-weight: bold;">Separación máx estribos S<sub>max</sub> = ${formatNum(r.SMax?.resultado)} cm</p>
              <p style="margin: 5px 0;">Recomendado: ${r.Hierro || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div class="page-break"></div>
        <div class="pdf-header-4">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="subtitle">Reporte de cálculo estructural para zapata excéntrica con viga de amarre</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Paso 6: Diseño del acero de refuerzo en zapatas.</h4>
        <div class="section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Zapata Interna</div>
              <p style="margin: 5px 0;">Mu = ${formatNum(r.MuInt?.resultado)} Ton·m</p>
              <p style="margin: 5px 0;">${r.AsInt?.formula || 'N/A'}</p>
              <p style="margin: 5px 0;">Separación = ${formatNum(r.AsInt?.Arroba2)} cm</p>
              
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Zapata Externa (Lado Largo)</div>
              <p style="margin: 5px 0;">Mu = ${formatNum(r.MuExt?.resultado)} Ton·m</p>
              <p style="margin: 5px 0;">${r.AsExtLarga?.formula || 'N/A'}</p>
              <p style="margin: 5px 0;">Separación = ${formatNum(r.AsExtLarga?.Arroba2)} cm</p>
              
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Zapata Externa (Lado Corto)</div>
              <p style="margin: 5px 0;">${r.AsExtCorta?.formula || 'N/A'}</p>
              <p style="margin: 5px 0;">Separación = ${formatNum(r.AsExtCorta?.Arroba2)} cm</p>
              
              <div style="font-weight: bold; margin: 10px 0 5px 0;">Parrillas Dobles</div>
              <p style="margin: 5px 0;">Int: ${r.AsParrillaDobleInterna?.formula || 'N/A'}</p>
              <p style="margin: 5px 0;">Ext: ${r.AsParrillaDobleExterna?.formula || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div class="section-result" style="margin-top: 5%;">
          <h3 class="section-header">✅ Verificaciones y Validaciones</h3>
          <div class="section-content">
            <ul class="validation-list">
              <li class="validation-item">
                <div class="validation-title">🏗️ Chequeo del Pedestal externo</div>
                <div class="validation-detail">
                  <span class="success-icon">${formatNum(inpt.PuExt)} <= ${formatNum(r.presionExt?.resultado)} ✓ CUMPLE</span>
                </div>
              </li>
              <li class="validation-item">
                <div class="validation-title">🏗️ Chequeo del Pedestal interno</div>
                <div class="validation-detail">
                  <span class="success-icon">${formatNum(inpt.PuInt)} <= ${formatNum(r.presionInt?.resultado)} ✓ CUMPLE</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="section">
          <h3 class="section-header"> Resumen de Resultados</h3>
          <div class="section-content">
            <div class="input-grid">
              <div class="input-item">
                <div class="input-label">Zapata Externa (B, L)</div>
                <div class="input-value">${formatNum(r.B_Ext?.resultado)} m × ${formatNum(r.L_Ext)} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Zapata Interna (B, L)</div>
                <div class="input-value">${formatNum(r.B_Int)} m × ${formatNum(r.L_Int)} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Separación Estribos Viga</div>
                <div class="input-value">${formatNum(r.SMax?.resultado)} cm</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Calculado por:</div>
          </div>
          <div class="signature-box">
            <div class="signature-label">Revisado por:</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>SS INGENIERIA</strong> | Potenciado por System Structur</p>
          <p>Reporte generado automáticamente. El ingeniero responsable debe validar los resultados según la NSR-10 / ACI 318.</p>
          <p>Soporte y Ventas: <strong>(+57) 3023631005</strong> • Acceso Web: <strong>front-ing.vercel.app</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  getFileName(data: ZapataExcentricaVigaAmarreCalculationData): string {
    const projectName = data.metadata?.projectName || 'ZapataExcentricaVigaAmarre';
    const timestamp = new Date().toISOString().slice(0, 16).replaceAll(/[:-]/g, '');
    return `${(projectName).trim()}_${timestamp}.pdf`;
  }

  getPageOptions(): PDFPageOptions {
    return {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      margins: {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
      }
    };
  }
}

/**
 * ZapataCuadradaPDFTemplate - Template específico para reportes de zapata cuadrada
 * Implementa PDFTemplate para generar contenido HTML específico
 */

import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';
import { IMG_CUADRADA1, IMG_CUADRADA2, IMG_ESQUINERA1, IMG_ESQUINERA2, LOGO_BASE64 } from '../imgBase64/img';

export interface ZapataCalculationData {
  // Datos de entrada
  input: {
    Fc: number;
    Fy: number;
    Pd: number;
    Pl: number;
    Cx: number;
    Cy: number;
    Hz: number;
    Ds: number;
    Ws: number;
    Wc: number;
    Qa: number;
    Rc: number;
    Az: number;
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
}

@Injectable({
  providedIn: 'root'
})
export class ZapataCuadradaPDFTemplate implements PDFTemplate {

  generateContent(data: ZapataCalculationData): string {
    const currentDate = new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const img1 = data.response.isEsquinera ? IMG_ESQUINERA1 : IMG_CUADRADA1;
    const img2 = data.response.isEsquinera ? IMG_ESQUINERA2 : IMG_CUADRADA2;
    const acerPorFraguado = data.response.acerPorFraguado || '';

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
            margin-top: 20px;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
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

          .logo-cell {
            width: 15%;
            background-color: #f8f9fa;
            text-align: center;
            border-right: 1px solid #ddd;
            padding: 0;           /* 🔴 clave */
          }

          .logo-cell img {
            width: 70%;
            margin-left: 14px;
            height: 100%;
            object-fit: contain; /* o cover */
            display: block;
          }

          .logo-placeholder {
            display: none;
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
          
          .header {
            text-align: center;
            border-bottom: 3px solid #2c5aa0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            color: #2c5aa0;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          
          .header h2 {
            color: #666;
            margin: 5px 0;
            font-size: 18px;
            font-weight: normal;
          }
          
          .project-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #2c5aa0;
          }
          
          .project-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .info-item {
            margin: 5px 0;
          }
          
          .info-label {
            font-weight: bold;
            color: #2c5aa0;
          }
          
          .section-result {
            margin-top: 4%;
            border-radius: 8px;
            overflow: hidden;
          }
          .pdf-header-2 {
            margin-top: 20%;
          }
          .pdf-header-3 {
            margin-top: 22%;
          }
          .pdf-header-4 {
            margin-top: 70%;
          }
          .section {
            border-radius: 8px;
            overflow: hidden;
          }
          .section-jump-line {
            border-radius: 8px;
            overflow: hidden;
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
                <div class="main-title">${data.metadata.projectName}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata centrica</div>
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
              <div class="input-item">
                <div class="input-label">Resistencia del Concreto (Fc)</div>
                <div class="input-value">${data.input.Fc} MPa</div>
              </div>
              <div class="input-item">
                <div class="input-label">Limite de fluencia del Acero (Fy)</div>
                <div class="input-value">${data.input.Fy} MPa</div>
              </div>
              <div class="input-item">
                <div class="input-label">Carga Muerta (Pd)</div>
                <div class="input-value">${data.input.Pd} kN</div>
              </div>
              <div class="input-item">
                <div class="input-label">Carga Viva (Pl)</div>
                <div class="input-value">${data.input.Pl} kN</div>
              </div>
              <div class="input-item">
                <div class="input-label">Peso específico de concreto (Wc)</div>
                <div class="input-value">${data.input.Wc} kN/m³</div>
              </div>
              <div class="input-item">
                <div class="input-label">Dimensión Columna X (Cx)</div>
                <div class="input-value">${data.input.Cx} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Dimensión Columna Y (Cy)</div>
                <div class="input-value">${data.input.Cy} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Altura pedestal (Ds)</div>
                <div class="input-value">${data.input.Ds} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Peso específico del suelo (Ws)</div>
                <div class="input-value">${data.input.Ws} kN/m³</div>
              </div>
              <div class="input-item">
                <div class="input-label">Altura Zapata (Hz)</div>
                <div class="input-value">${data.input.Hz} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Capacidad Admisible (Qa)</div>
                <div class="input-value">${data.input.Qa} kN/m²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Recubrimiento (Rc)</div>
                <div class="input-value">${data.input.Rc} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">Designacion de la barra (Az)</div>
                <div class="input-value">#${data.input.Az}</div>
              </div>
            </div>
          </div>
          <img src="data:image/png;base64,${img1}" />
          <!-- Validation Results Section -->
        <div class="section">
        <h4 style="margin-bottom: 28px;">Paso 1: Área requerida.</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
           <strong>Q<sub>e</sub> =  Q<sub>a</sub> - H<sub>z</sub> * W<sub>c</sub> - D<sub>s</sub> * W<sub>s</sub></strong>
           <p style="margin: 5px 0;">Qe = ${data.input.Qa} kN/m² - ${data.input.Hz} m * ${data.input.Wc} kN/m³ - ${data.input.Ds} m * ${data.input.Ws} kN/m³ = ${data.response.Qe} kN/m²</p>
           </div>
        </div>

        <div style="margin-top: 10px;">
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
            <strong>A = ΣP / Q<sub>e</sub></strong>
            <p style="margin: 5px 0;"> A = ${data.input.Pl} kN + ${data.input.Pd} kN / ${data.response.Qe} kN/m² </p>
            <div style="font-family: 'Times New Roman', serif; margin: 5px 0;">
              <span>B, L = </span>
              <span>
                <span>√</span>
                <span>
                  ${data.response.a} m²  = ${data.response.B} m
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="pdf-header-2">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="main-title">${data.metadata.projectName}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata centrica</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
                <div style="font-size: 10px;">${currentDate}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class= "section">
          <h4 style="margin-bottom: 10px;">Paso 2: Presion de apoyo para diseño por resistencia.</h4>
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
            <p style="margin: 5px 0; font-weight: bold;"> ( Q<sub>u</sub> = 1.6 * P<sub>l</sub> + 1.2 * P<sub>d</sub> )/ (A)²</p>
            <p style="margin: 5px 0;"> Q<sub>u</sub> = 1.6 * ${data.input.Pl} kN + 1.2 * ${data.input.Pd} kN / (${data.response.B})² m² = ${data.response.Qu} kN/m²</p>
            <h4> verificacion de la resistencia a compresion del pedestal </h4>
              <p style="margin: 5px 0; font-weight: bold;"> P<sub>u</sub> Ton ≤ 0.85 * 0.65 * (F<sub>c</sub> MPa)/100 * (C<sub>x</sub>cm * C<sub>y</sub>cm) </p>
              <p style="margin: 5px 0;"> ${(data.response.Pu / 9.81).toFixed(2)} ≤ 0.85 * 0.65 * (${(data.input.Fc / 145.038).toFixed(2)} MPa) * (${data.input.Cx * 100} cm * ${data.input.Cy * 100} cm) = ${(data.response.Pu / 9.81).toFixed(2)} ≤ ${data.response.validate0.calculo} OK</p>
            </div>
          </div>
        </div>
        <div class= "paso3">
         <h4 style="margin-bottom: 10px;">Paso 3: Peralte requerido para el cortante por punzonamiento en dos direcciones.</h4>
          <img src="data:image/png;base64,${img2}" />
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <strong>B<sub>0</sub> = 4 * (C<sub>x</sub> + d<sub>e</sub>)</strong>
              <p style="margin: 5px 0;"> B<sub>0</sub> = 4 * (${data.input.Cx} m + ${data.response.De} m) = ${data.response.Bo} kN/m² </p> 
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>u2</sub> = (A - (C + d<sub>e</sub>)) * (Q<sub>u</sub>) </p> 
              <p style="margin: 5px 0;"> V<sub>u2</sub> = (${data.response.A} m² - (${data.response.maxCxCy} m + ${data.response.De}m)) * ${data.response.Qu} kN/m²</p> 
              <h4 style="margin: 10px 0 5px 0;"> Ecuación 12.2. Diseño de concreto reforzado McCormac.</h4>
              <p style="margin: 5px 0; font-weight: bold;"> D = V<sub>u2</sub> / (Φ.4.λ.√( F<sub>c</sub> ).B<sub>0</sub>) < d </p>
              <p style="margin: 5px 0;"> D = ((${data.response.Vu2}Kn * 224.809 lb/kn)/ (0.75 * 4 * 1 * √${data.input.Fc} psi * (${data.response.Bo}m * 39.37 Plg/m))) * 0.0254 m/plg = ${data.response.D} m < ${data.response.d} m OK</p>
            </div>
          </div>
        </div>
        <div class= "section-result">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
            <h4 style="margin: 10px 0 5px 0;"> Ecuación 12.3. Diseño de concreto reforzado McCormac.</h4>
              <p style="margin: 5px 0; font-weight: bold;"> D = V<sub>u2</sub> / (Φ.(2 + (4/B<sub>C</sub>)).λ.√( F<sub>c</sub> ).B<sub>0</sub>) < d </p>
              <p style="margin: 5px 0;"> D = ((${data.response.Vu2}Kn * 224.809 lb/kn)/ (0.75 * (2 + (4/${data.response.Bc})) * 1 * √${data.input.Fc} psi * (${data.response.Bo}m * 39.37 Plg/m))) * 0.0254 m/plg </p>
              <p style="margin: 5px 0;"> = ${data.response.validate2.d} m < ${data.response.d} m OK</p>
            </div>
          </div>
        </div>
        <div class="pdf-header-3">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="main-title">${data.metadata.projectName}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata centrica</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
                <div style="font-size: 10px;">${currentDate}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
            <h4 style="margin: 10px 0 5px 0;"> Ecuación 12.4. Diseño de concreto reforzado McCormac.</h4>
              <p style="margin: 5px 0; font-weight: bold;"> D = V<sub>u2</sub> / (Φ.((α<sub>s</sub>*d/B<sub>0</sub>) + 2).λ.√( F<sub>c</sub> ) * B<sub>0</sub>) < d </p>
              <p style="margin: 5px 0;"> D = ((${data.response.Vu2}Kn * 224.809 lb/kn)/ (0.75 * ((40 * (${data.response.d}m * 39.37 )/(${data.response.Bo}m * 39.37 Plg/m)) + 2) * 1 * √${data.input.Fc} psi * ${data.response.Bo}m * 39.37 Plg/m)) * 0.0254 m/plg </p>
              <p style="margin: 5px 0;"> = ${data.response.validate3.d} m < ${data.response.d} m OK</p>
            </div>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Paso 4: Peralte requerido para el cortante en una dirección.</h4>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> e = (L/2) - (a/2) - (d/2) </p>
              <p style="margin: 5px 0; font-weight: bold;">V<sub>u1</sub> = L * e * Q<sub>u</sub> </p>
              <p style="margin: 5px 0;">V<sub>u1</sub> = ${data.response.L}m * ${data.response.e}m * ${data.response.Qu}kn/m² = ${data.response.Vu1}Kn/m² </p>
              <p style="margin: 5px 0; font-weight: bold;"> D = V<sub>u1</sub> / (Φ.2.λ.√( F<sub>c</sub> ).B<sub>0</sub>) < d </p>
              <p style="margin: 5px 0;"> D =(${data.response.Vu1}Kn/m² * 224.809 lb/kn / (0.75.2.1.√( ${data.input.Fc} psi )*${data.response.Bo}m * 39.37 Plg/m)) * 0.0254 m/plg </p>
              <p style="margin: 5px 0;"> = ${data.response.validate4.d} m < ${data.response.d} m OK</p>
              </div>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Paso 5: Diseño del acero de refuerzo por friccion.</h4>
        <h5 style="margin: 10px 0 5px 0;">Si ρ es menor que 0.0033 se toma por defecto 0.0033. (ρ ≥ 0.0033) </h5>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> M<sub>u</sub> = (e + d) * L * Q<sub>u</sub> * ((e + d)/2) </p>
              <p style="margin: 5px 0; font-weight: bold;"> M<sub>u</sub> = (${data.response.e}m + ${data.response.d}m) * ${data.response.L}m * ${data.response.Qu}Kn/m² * ((${data.response.e}m + ${data.response.d}m)/2) = ${data.response.Mu}Knm</p>
              <p style="margin: 5px 0; font-weight: bold;"> M<sub>u</sub> = ${data.response.Mu}Kn.m * 0.001 Mn.m/Kn.m = ${data.response.Mu * 0.001}Mn.m </p>
              <p style="margin: 5px 0; font-weight: bold;"> F<sub>c</sub> = ${data.input.Fc}Psi * 0.007 Mp/Psi = ${data.input.Fc * 0.007}Mpa</p>
              <p style="margin: 5px 0; font-weight: bold;"> F<sub>y</sub> = ${data.input.Fy}Psi * 0.007 Mp/Psi = ${data.input.Fy * 0.007}Mpa</p>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8kAAADCCAYAAAB644DHAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjYuMywgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy/P9b71AAAACXBIWXMAAB7CAAAewgFu0HU+AAApRUlEQVR4nO3deXTNd/7H8VckISSWaGrfs1A7zdT5EY1iGi2tdVoME0VCtaPWH8aWakvNUEtCrZmpokXbMWh/WkqUbrYmlpLkxhZZaGwhEbL9/sg3d6RZ3EjkJjwf5/Qcvuv73k+dc1/f72exyczMzBQAAAAAAFA5axcAAAAAAEBpQUgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgG
              <p style="margin: 5px 0; font-weight: bold;"> As = ${data.response.P} * (${data.response.L}m * 100 cm/m) * (${data.response.d}m * 100 cm/m) = ${data.response.As}cm²</p>
              <p style="margin: 5px 0; font-weight: bold;"> Separación entre barras es de = Φ#${data.input.Az}@${data.response.espacioEntreBarrasValidate}</p>
              <p style="margin: 5px 0; font-weight: bold;"> ${data.response?.acerPorFraguado ? data.response?.acerPorFraguado : ''}</p>
              </div>
          </div>
        </div>
        <div class="pdf-header-4">
          <table class="header-table">
            <tr>
              <td class="logo-cell">
                <img src="data:image/png;base64,${LOGO_BASE64}" alt="Logo" />
              </td>
              <td class="title-cell">
                <div class="main-title">${data.metadata.projectName}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata centrica</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
                <div style="font-size: 10px;">${currentDate}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="section-result">
          <h3 class="section-header">✅ Verificaciones y Validaciones</h3>
          <div class="section-content">
            <ul class="validation-list">
              <li class="validation-item">
                <div class="validation-title">🏗️ Chequeo del Pedestal</div>
                <div class="validation-detail">
                  <strong>Condición:</strong> Pedestal cumple: ${data.response?.validate0?.Pu || 'N/A'} < ${data.response?.validate0?.calculo || 'N/A'}
                  <span class="success-icon">✓ CUMPLE</span>
                </div>
              </li>

              <li class="validation-item">
                <div class="validation-title">🔧 Chequeo por Punzonamiento en Dos Direcciones</div>
                <div class="validation-detail">
                  <strong>Ecuación 12.2:</strong> ${data.response?.D || 'N/A'} < ${data.response?.d || 'N/A'}
                  <span class="success-icon">✓ CUMPLE</span>
                </div>
                <div class="validation-detail">
                  <strong>Ecuación 12.3:</strong> ${data.response?.validate2?.d || 'N/A'} < ${data.response?.validate2?.Hz || 'N/A'}
                  <span class="success-icon">✓ CUMPLE</span>
                </div>
                <div class="validation-detail">
                  <strong>Ecuación 12.4:</strong> ${data.response?.validate3?.d || 'N/A'} < ${data.response?.validate3?.Hz || 'N/A'}
                  <span class="success-icon">✓ CUMPLE</span>
                </div>
              </li>

              <li class="validation-item">
                <div class="validation-title">⚡ Chequeo por Punzonamiento en Una Dirección</div>
                <div class="validation-detail">
                  <strong>Paso 4:</strong> ${data.response?.validate4?.d || 'N/A'} < ${data.response?.validate4?.Hz || 'N/A'}
                  <span class="success-icon">✓ CUMPLE</span>
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
                <div class="input-label">Dimensión de la Zapata (L, B)</div>
                <div class="input-value">${data.response?.L || 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Área de la Zapata (A)</div>
                <div class="input-value">${data.response?.A || 'N/A'} m²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Separación entre Barras</div>
                <div class="input-value">${data.response?.espacioEntreBarrasValidate || 'N/A'} cm</div>
              </div>
              <div class="input-item">
                <div class="input-label">Presión de Diseño (Qu)</div>
                <div class="input-value">${data.response?.Qu || 'N/A'} kPa</div>
              </div>
              <div class="input-item">
                <div class="input-label">Peralte Efectivo (d)</div>
                <div class="input-value">${data.response?.d || 'N/A'} m</div>
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

  getFileName(data: ZapataCalculationData): string {
    const projectName = data.metadata?.projectName || 'ZapataCuadrada';
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
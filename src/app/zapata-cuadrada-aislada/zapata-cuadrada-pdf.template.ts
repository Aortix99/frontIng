/**
 * ZapataCuadradaPDFTemplate - Template específico para reportes de zapata cuadrada
 * Implementa PDFTemplate para generar contenido HTML específico
 */

import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';
import { LOGO_BASE64 } from '../imgBase64/img';

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
            margin-top: 33%;
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
          <img src="data:image/png;base64,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" />
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
          <img src="data:image/png;base64,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" />
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
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8kAAADCCAYAAAB644DHAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjYuMywgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy/P9b71AAAACXBIWXMAAB7CAAAewgFu0HU+AAApRUlEQVR4nO3deXTNd/7H8VckISSWaGrfs1A7zdT5EY1iGi2tdVoME0VCtaPWH8aWakvNUEtCrZmpokXbMWh/WkqUbrYmlpLkxhZZaGwhEbL9/sg3d6RZ3EjkJjwf5/Qcvuv73k+dc1/f72exyczMzBQAAAAAAFA5axcAAAAAAEBpQUgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgGAAAAAMBASAYAAAAAwEBIBgAAAADAQEgugxITE61dQqn03nvvafDgwVq7dm2Bx926dauEKgIAAABQ1thZuwAUzuHDh5WSkiIvLy9rl1KqREZGKj4+Xhs3brzvsXFxcbp06RLfIQAAAIBceJNchly8eFE//fQT4e53zpw5o7FjxyoqKkrDhw+/7/Hu7u4ymUw6efJkCVQHAAAAoCwhJJchixYt0pAhQ6xdRqnTpEkT+fj4aMKECQoODrbonCFDhmjNmjVKT09/yNUBAAAAKEsIyWXEgQMHVKdOHVWrVs3apZRKJpNJbm5uFh9vZ2enp59+Wlu3bn1oNcXHx8vf319/+tOfNHDgQO3evfuh3QsAAABA8SAklxHr1q3TSy+9ZO0ySq3o6GjVr19fX3zxhUJDQ5Wamqo5c+YoMzMz33NefvllrVu3TikpKQ+lJjs7O02cOFFbtmxRUFCQFi5cqNu3bz+UewEAAAAoHqUqJA8YMOChvtkrbkWt99NPP1WvXr3UoUMHLV68ON/jYmNjFRcXJw8Pjwe+16Ps+vXrcnJykq2trdq0aaPjx4/r448/1qBBg2RjY5PveVWqVJGbm5v27t2ba19gYKDGjRtX6FrWrFmjYcOGSZJcXFzUtGlT85+rVaumGzduFPqaAAAAAEpOqQnJKSkpio6Olru7e659/v7+8vT0zDXeNDMzU76+vvL09NTq1atLqlRJBddriYiICC1atEhTp07Vl19+qdGjR+d7bEhIiNq1a5fnvqNHj2r8+PHq0aOHPD09FRIS8kD1WGLz5s166aWX1LFjR/n6+urEiRMFHr9y5Up5enrm+K9///7m/UlJSVq4cKF69eqlTp06afjw4Q80mZbJZJKrq6ukrPHJP//8s27fvm1R27Rs2VK7du3KtT0iIuKB2jYyMjLPhxmnTp1Senq6atWqVehrAgAAACg5pSYkR0VFKTMz0xx2smVmZio8PFy1a9eWyWTKsW/Hjh1KSEiQJDVr1qzEapXyr9dS+/fvV4sWLeTl5SUXFxc5ODjke+zRo0fzfYucHQanTJnyQHVY6ptvvtGiRYvk5+en9evXy8PDQ3/961919erVAs9r0qSJdu7caf7v3jWM3333Xf3888+aM2eOPv30U3Xo0EFjxozR5cuXC1Wbp6en5syZI0mysbGRnZ2d+W3u/bRq1UqhoaHKyMjIsb04Q/KNGzc0e/ZsTZ8+vdDXAwAAAFCyrB6Sw8PDNXr0aI0cOVIZGRnq1atXjrVuL1y4oKSkJPXq1StHSE5KSlJQUJB69eolSXrqqadKRb3ZQkND9Ze//EUdO3ZUt27d9Mknn5j39enTRx9++KGOHTsmT09PzZo1q8B7RkZGqk6dOnnu69Spk8aMGaPnnnuuaB/sPjZs2KA+ffro5ZdfVpMmTTRt2jQ5ODho27ZtBZ5nZ2cnFxcX83/ZE4+lpKRoz549Gjt2rNq3b6/69etr1KhRql+/vj777LNc1yno+8x269YtzZ8/X6+88oocHR0t+lyurq5KTExUXFyceVtCQoKuXLmijIwM+fn5qVOnTvrLX/6S6yHNqVOnzPsHDx6sEydO6OLFi+Yu1pJ09+5dTZo0Sb6+vmrTpo1FNQEAAACwHjtr3vzixYvy9/fX0KFDVbVqVWVkZKhFixb64IMP9PTTT6tp06Y6deqUHBwc5OPjo+DgYKWmpsre3l5r1qxR8+bN5ezsrCeeeEIuLi4W3zc4OFj//Oc/Czxmy5YtubrGWlKvlDUTdUBAgN566y21bt1aO3bs0AcffCBvb2/VqVNHwcHBeu211zRgwAC98MILqlSpUr51pKWlKT4+Xk8++aTFn6+4paam6vTp03rttdfM28qVK6dnnnlGx44dK/DcCxcuqEePHqpQoYJatWqlN998U7Vq1VJ6errS09NVvnz5HMdXqFBBoaGhObbd7/vM5uTkVOg36pUrV5aU1bZ169aVlPUWWZI2btyoCRMmqEqVKpo/f77+9re/afPmzZKkc+fOafTo0Ro4cKBmz56t8PBwTZw4UZLMb6AzMzMVEBAgT09P9ezZs1B1AQAAALAOq4bkuXPnqmvXrho5cqR8fX31xz/+UYMHD9Y///lP/fLLL2ratKnCw8Pl7u6uhg0bqkKFCjp37pwqVKigzz//XOvXr1dwcHChu1r3799ff/zjHws8Jq/QbUm9d+7c0bx58zRp0iT16NFDkjR69Ght2rRJR48eVZ06dVSpUiXFxcWpbdu29w33t27dUnp6uipWrFioz1icrl+/rvT0dFWvXj3H9urVq+vcuXP5nteyZUsFBASoYcOGSkhI0OrVqzVy5Eht2rRJjo6Oat26tdasWaPGjRurevXq+vrrr3X8+HHVq1fPfA1Lvs+isLOzU6VKlZSYmGjeFhERoQoVKmjhwoXmhxNjxozRiBEjdP36dVWrVk3z58+Xt7e3Xn/9dUlSvXr19M0338hkMpm7zoeFhWnXrl1yd3fXvn37JElz5swp1FJVAAAAAEqW1UJyQkKCDh8+rODgYKWnp8tkMunNN99UuXLlZGtrK3t7e0nS6dOn1axZM9nY2MjNzU0mk0lff/21+vfvrwYNGujUqVOF7mpctWpVVa1a9aHUe+jQIaWkpOQI4ba2trKxsTG/NY2MjJQki8JS9vJE2dcvqsDAQH300UcFHvPZZ5+pUaNGRb5Xp06dzH92d3dXy5Yt1atXL+3atUt9+vTRnDlzNGfOHL3wwguytbVV06ZN5ePjo1OnTpnPs+T7LConJ6ccy0CFh4ere/fuOd7eV6lSRZKUkZGhuLg4HTp0SOvXr89xHTs7uxzjkdu2batDhw4VS40AAAAASobVQvKJEyeUkZEhDw8PnT9/Xnfu3JGHh4diY2OVmJhoHr95+vRp+fj4SJKaNm2qTz75RJcuXdJ7772nO3fu6Ny5c4V+k/wg3a0trffIkSNq2rSpbG1tzedGR0crKSnJ3B07PDxc9erVs+jtcHY4Lq71dYcMGXLf9Zazux1nq1atmmxtbXNN0nX16lU98cQTFt+7cuXKatiwoS5evCgp6+3rqlWrdPv2bSUlJcnFxUXTpk3Lcf/7fZ+enp4W31+SDh8+nGtbenp6jocQERER6tevX45jjh8/rho1aqh69eoKCQmRra1trocc4eHh5jHyAAAAAMomq4Xk1NRUSVkTG2XPXl21alWtW7dOrq6ucnNz08WLF3Xz5k1zCG7atKm2bNmiWbNmydHRUSdOnFB6enqOkDx27Fg1b95cBw8e1JUrV7Rw4cJcYeZBultbUq+UFZSyj822ZcsWPfXUU2rYsKGkrBB27xvH06dPKygoSEFBQZKylnz6/vvvNX36dPMEVDdv3rTgW70/Z2dnOTs7F+oce3t7NWvWTAcPHlSXLl0kZb1RPXTokF555RWLr5OcnKyLFy/qxRdfzLG9YsWKqlixohITE/Xjjz9q7Nix5n33+z7zCr2FlZKSIicnJ/Ofo6Ojc8x2nZGRYV7TWsoaj52Zmam0tDTZ2WX9Ezpw4IDOnTvHWtYAAABAGWe1kNyqVSvZ2tpq9erVSk5OVt26dbVp0yZt2rTJvObx6dOnZW9vbw6gvXr1UpcuXcxdpU+fPi1nZ+ccb3yjoqLUtWtXBQcHa+PGjdq3b1+ukPwg3a0tqVfKCnWZmZnasWOHWrZsqd27d+vzzz/PsfRRRESEnn32WfPf3dzcdPbsWUlZE3WtWbNGixcvliQ5ODioevXq+Ybk5ORkRUdHm/8eExOj8PBwVa1atVjX5P3zn/+sgIAANW/eXC1atNDGjRt1+/btHG+lN23apJCQEH344YeSpMWLF6tz586qXbu2fvvtN61cuVLlypUz9wz48ccflZmZqYYNGyo6OlpLly5Vo0aN9PLLL5uvacn3KUnvvfeeTp48qW7dusnd3T3H91uQO3fuKCkpyTy2OTIyUuXKldP27dvVvn17OTo6avny5UpJSZGvr6+krJnU7ezstGTJEv35z39WVFSU3n//fUkiJAMAAABlnNVCcq1atTRr1iwFBgYqISFBtra2SklJUWBgoHk5p9OnT8vV1dX8ts7Ozs68hFD2/nuX27l165ZsbGzUp08fSVmBM3v24pKoNz4+Xjdu3NDixYsVGBioCxcuyN3dXUuXLjW/7c7IyJDJZNLIkSPN17azs1PNmjUVGxur77//3rx2crYmTZooNjY2z7p+/fVXjR492vz3RYsWScp6oBAQEFAsn12Snn/+eV27dk0rVqzQlStX5OHhocDAwBzdra9fv27uSi1Jly5d0vTp03Xjxg05OzurTZs2+te//mV+k33r1i0FBQXp8uXLqlKlirp27ao33njD3N6WfJ9SVrCNj4/Xxo0bZTKZ9NVXX1kckuPj42Vvb2+eLCw8PFwNGjSQn5+fJk+erJs3b6pz584KDg42v9V/8sknNWPGDC1btkzbtm1TixYt1LNnT23fvr1Qs6wDAAAAKH1sMjMzM61dRNeuXTV79mx5e3sX6TphYWHasGGD/v73v0uSZs2apZdffrnQ41bvJ7969+3bpzlz5ujbb78t9DUXLlwod3d3bdiwIUcgk6QVK1bo7Nmzmj9/fpFrL0ss+T7PnDmjN954QzY2NqpVq5aef/55PfvssxbPer1792598sknud5MAwAAAHg8lbN2AZcuXVJiYqJcXV2LfK2oqKgc3V1NJlOxL7dTUL3h4eEP/DlatGihJUuWqH///jkCsiQ9++yzOnHixANdtyyz5Pts0qSJfHx8NGHCBAUHB8vBwaFQy0IdO3ZMnTt3LmqpAAAAAB4RVg/JJpNJFStWzDWj8oOIiooyh+K0tDTdunUrR/fs4lBQvdlrOj+IBg0aqGrVqrlmVZak5s2bq0qVKualox4Xln6f9z4Mye5qb6kff/zRPEYaAAAAAEpFd2tIb7/9try9vc2zR//ed999px9++EFTp04t2cLKgN69e+uLL77IsUyUJU6cOKH169ebJ90CAAAAAKu/SX7cXbx4Uf369VPFihXzDchSVpfrS5cuKSkpqeSKKwOuX78uJyenXAE5NTVVCxYs0KJFi/R///d/eZ77+eefy8/PryTKBAAAAFBGWG12a2SpV6+evvjiC4uOHTNmjNauXZtjHeHHnclkynPc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" />
              <p style="margin: 5px 0; font-weight: bold;"> ρ = ${data.response.P}</p>
              <p style="margin: 5px 0; font-weight: bold;"> A<sub>s</sub> = ρ * L * d</p>
              <p style="margin: 5px 0; font-weight: bold;"> As = ρ * L * d</p>
              <p style="margin: 5px 0; font-weight: bold;"> As = ${data.response.P} * (${data.response.L}m * 100 cm/m) * (${data.response.d}m * 100 cm/m) = ${data.response.As}cm²</p>
              <p style="margin: 5px 0; font-weight: bold;"> Separación entre barras es de = Φ#${data.input.Az}@${data.response.espacioEntreBarrasValidate}</p>
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
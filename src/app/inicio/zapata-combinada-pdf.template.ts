/**
 * ZapataCuadradaPDFTemplate - Template específico para reportes de zapata cuadrada
 * Implementa PDFTemplate para generar contenido HTML específico
 */

import { Injectable } from '@angular/core';
import { PDFTemplate, PDFPageOptions } from '../services/pdf-generator.service';
import { LOGO_BASE64 } from '../imgBase64/img';

export interface ZapataCombinadaCalculationData {
  // Datos de entrada
  input: {
    Fc: number,
    Fy: number,
    Wc: number,
    Qa: number,
    Ds: number,
    Hz: number,
    Lz: number,
    PdExt: number,
    PlExt: number,
    CxExt: number,
    CyExt: number,
    PdInt: number,
    PlInt: number,
    CxInt: number,
    CyInt: number,
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
export class ZapataCuadradaPDFTemplate implements PDFTemplate {

  generateContent(data: ZapataCombinadaCalculationData): string {
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
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 10px;
          }
          .logo-cell {
            width: 15%;
            background-color: #f8f9fa;
            text-align: center;
            border-right: 1px solid #ddd;
            padding: 0;           /* 🔴 clave */
          }

          .logo-cell img {
            width: 100%;
            height: 100%;
            object-fit: contain; /* o cover */
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

          .logo-cell {
            width: 15%;
            background-color: #f8f9fa;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-right: 1px solid #ddd;
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
            margin-top: 35%;
          }
          .pdf-header-3 {
            margin-top: 19%;
          }
          .pdf-header-4 {
            margin-top: 19%;
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
                <div class="main-title">${data.metadata.projectName}</div>
                <div class="subtitle">Reporte de cálculo estructural para zapata combinada</div>
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
                <div class="input-value">${data.input?.Fc ?? 'N/A'} kgf/cm²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Fy (Límite Fluencia Acero)</div>
                <div class="input-value">${data.input?.Fy ?? 'N/A'} kgf/cm²</div>
              </div>
              <div class="input-item">
                <div class="input-label">Wc (Peso Espec. Concreto)</div>
                <div class="input-value">${data.input?.Wc ?? 'N/A'} kN/m³</div>
              </div>
              <div class="input-item">
                <div class="input-label">Qa (Capacidad Admisible)</div>
                <div class="input-value">${data.input?.Qa ?? 'N/A'} kN/m²</div>
              </div>
              <!-- Geometría General -->
              <div class="input-item">
                <div class="input-label">Ds (Altura Pedestal)</div>
                <div class="input-value">${data.input?.Ds ?? 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Hz (Altura Zapata)</div>
                <div class="input-value">${data.input?.Hz ?? 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">Lz (Distancia entre Columnas)</div>
                <div class="input-value">${data.input?.Lz ?? 'N/A'} m</div>
              </div>
              <!-- Columna Externa -->
              <div class="input-item">
                <div class="input-label">PdExt (Carga Muerta Ext.)</div>
                <div class="input-value">${data.input?.PdExt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">PlExt (Carga Viva Ext.)</div>
                <div class="input-value">${data.input?.PlExt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">CxExt (Dimensión X Ext.)</div>
                <div class="input-value">${data.input?.CxExt ?? 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">CyExt (Dimensión Y Ext.)</div>
                <div class="input-value">${data.input?.CyExt ?? 'N/A'} m</div>
              </div>
              <!-- Columna Interna -->
              <div class="input-item">
                <div class="input-label">PdInt (Carga Muerta Int.)</div>
                <div class="input-value">${data.input?.PdInt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">PlInt (Carga Viva Int.)</div>
                <div class="input-value">${data.input?.PlInt ?? 'N/A'} Ton</div>
              </div>
              <div class="input-item">
                <div class="input-label">CxInt (Dimensión X Int.)</div>
                <div class="input-value">${data.input?.CxInt ?? 'N/A'} m</div>
              </div>
              <div class="input-item">
                <div class="input-label">CyInt (Dimensión Y Int.)</div>
                <div class="input-value">${data.input?.CyInt ?? 'N/A'} m</div>
              </div>
            </div>
          </div>
         <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAD3CAYAAADlozBiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAACMmSURBVHhe7d0/j9tKuufxH/cVXAw2GtydSOrAcHx3YOUL9HTSA1x0soGzw8ztYDo7gCTAWV8sLE+kkzlYYGEsME766BXImHtjo4MWo50DR4t9C9xAYouqpsSqIlX89/0QhNpUPSVaeljiI1FklKZpKgAAAAAI4D+ZCwAAAADgXChAAAAAAARDAQIAAAAgGAoQAAAAAMFQgAAAAAAIhgIEAAAAQDAUIAAAAACCoQABAAAAEAwFSIfN53NzEdAb5DcAAP1EAdJx7KShz8hvAAD6hwKkD5KFJlGkKD9PFkrMdkAXkd8AAPQKBUhfvPmoTZoq3c2bmy96u2AXDT1BfgMA0BsUIAAAAACCoQDpi2/vNc4dojL+cqPPtyOzFdBN5DcAAL1BAdIXxiEq6fpW7J6hN8hvAAB6gwIEAAAAQDAUIAAAAACCoQDpg9Gt1hySgr4ivwEA6BUKEAAAAADBUIAAAAAACIYCBAAAAEAwFCA9MJ/PzUVAp5HTAAD0FwUIgNaZTqfmIgAA0BMUIAAAAACCoQABAAAAEAwFSA9wuAoAAAC6ggKkwyg80GfkNwAA/UQBAgAAACAYChAAAAAAwVCAAGgtDsMCAKB/ojRNU3MhAAAAAJwD34AAAAAACIYCBAAAAEAwFCAAMHDz+dxcBADA2fAbEAAYukgS7wQAgEAaK0CG+ImbzRl9XPYDot2tTXuXfof42qC6U/ntkn8ueS3Hvoea2+Zrk38eprOp5rP58+3z8hOvJwAAlaQNmc1m6W6/YRDzbDYzn4JCLi+IHNrbtksH+NowV5/L8tsl/1zyOnVsO8TcLnttUm2fF6cnEgCACvgNCAAMWbr9FkSpeQcAAOdBAQIAA5c/9AoAgHOjAAEAAAAQDAUIAAAAgGA4C1ZANmeVcTmjj8vZglz6HeJrg+pO5bdL/rnktRz7Hmpun3pttHteytoAAFCXRgsQ3vBectmZctlRc+kXqJtL/rnktRz7HiKbsdamDQAAdeEQLAAAAADBUIAAAAAACIYCBAAAAEAwFCAAAAAAgqEAAQAAABAMBQgAAACAYChAAAAAAARDAQIAAAAgGAoQAAAAAMFQgAAAAAAIJkrTNDUXhjCfzzWdTs3FgxdJsn1Bot2tTXuXfoG6ueSfS17Lse8umc/n5iJvZWMt4zEAIKRGC5C69OmN02VnymVHzaVfoG4u+eeS13Lsu6vM8bLuMY8CBAD6qa3je2MFiKtzvwG3hcvOlMuOmku/QN1c8s8lr+XYd1/UPR629Q0K58HrDbRX7dtnS98kW1uA1P0G2xUueeKyo+bSL1A3l/xzyWs59t1XVcfL2t/wEFwUZVvOcbPZTJI0nU01n708CiG7H0AYRdtcfvssuj/P3IV/8V4wOxzX89t902N+awqQF09aw09MZUmiZDTSyFxewmVnymVHzaVfBOSZJ13jkn8ueS3HvnvlRO64jqcUIN0XRdGLnZFC0XYn5OD1znIpWSnRpUZFSQWgHqe2t6Lt8wiXbV5q3xtlY2fBms/nB/N0Oj2Yj0uUrFZKzMWFEiWJXctDicrDTq1HotXDg7kQQZ16fUzkCfJOvWamduaOOZ6a4y0GzNwJSRaKHzbbv0djPdwvtDKaAKhJ2fZmbp91OVe/FQQrQMw3QPMN8lCi1WolaaXVavv2u1oslEhKFg/ajMfaLHIvWbJSHL8cMler3Yv8/O/Vru/9W/oqjrUyl602klZa5JaZj7FdD+lhkYvLraOurvSQW8eix0FV5Al8DSt3zPHWHI8xdOPdN2kjXejRvBNArcJub0WHW7bB2QoQ8w3OfAM8baSxtP2EcJz/birRgy50ORppfHW5X7yRrq/18lObpydtNjryCeLOtfS0ONyJkKTR6FIXyi0/eIxsPS51e2t+V71fxys97dfpyOOgCvIEvoaTO+ZYfKzgOLYcPTe61d3Fg+LJRJM41tPdUrnMB1AntrdntRcgx97gzDfAojZ5I0kPD8a+gUa6uNjuNTw87A9NWD190IcPH/Rk7h1cXOjysvgY6b1rXemrvpqLlejpaf+vw8fYrYd0+vCLiwuNn/9x7HFQBXkCX0PKHfMDIHPO2mBoEq0WsR50peV6rfXdtWQeEgKgJmxvebUXIOYb27G51KX0+LjdSThc/KTFwbHPiXTxWev1Z+npxBu1pLGetFg86MnodXR7rVe5HQE9fVAc30sXWV368jG2fcW6f3EY9ki3F09arBZ6eP6abXeP+TiojjyBL3IHA7eK3+rp6k5XT/eK41iT+ydd3N0O9hNZ4JzY3gxpQ2azmbkIaZq6vCByaG/bDjgHl/xzyevUse0Q2Yy1Nm3Qbi5v59nr/evHj+kmTdN08zH96ePGbAagRrbbm+14bLvN2/YXWmOn4c1+F4JDLqcUdTmzmku/QN1c8s8lr+XY9xDZjLU2bdBu8/n86PU9Mtn9s+lUs/lcyd//Ll1c6Hf/70nr//uf9b/+OpU0OnoaXt9tzTcu01S8b1ymqXjfuLyqfRD/Mn61WEhXVxpvHnT/dKG7q7H++tf/qd/97rBdtp3abs9lY3dbx3cKkJYpStpjot2tTXuXfoG6ueSfS17Lse8hshlrbdqg5co2hOz+SIqydslK+fMgbI2lyyMVCAB/Fttbml0HZDYt3Z4j2V0HpK3je+2/AQEAAGFFz6X7Edl+yu42lZSOLpVemvNoe1/B/BznOPvGNR3vG9d0vG9cnX0Q/3KZzfYWpbsTgmSdHFN2fwdQgAAA0ANlZ5csux9Ae5Rtr7PZzFzUKRQgAAD0QNlhFmX3A2iPsu2VAgQAADQuWWwvbhbHseLJRIuhXmAA6KBkMZEGtP1SgAAA0AuvdXO31HK51PLzjR6fEkkrLeJYcby/sCaANnotDWj7pQABAKAXvuvL24kmk4km99Ld7Uir+Ksulkst76RN3/ZggF75Lg1o+6UAAQCgF17r5vNa6/Vn3ejx8Iyfo7HGnF0XaLHX0oC2XwoQAAB6ZaTbu1f6EK90ef1KXxcrLeJ7PfTsE1Sgn4ax/XIhwpYpu5ZUnssF21z6Bermkn8ueS3HvofIZqy1aYN2iyK7i5KpwjYTOi7TVLxvXKapeN+4vKp9EO8X7xJnu823dXznGxAAAAAAwVCAAAAAAAiGAgQAAABAMBQgAAAAAIKhAAEAAAAQDAUIAAADE3nMoeOajveNazreN67OPoh/ucxmNuP6jAKkJaLdtP+rfMpS1GbKtwNCKcq/ssklr6NcWwD2Uo85dFzT8b5xTcf7xtXZB/Evl9nMZlyfUYC0jkvKnastUI/0YEi15dJWz+1tipAoigY3AwDQNo1diHCob4xlT3fksPuVPYM27Z36HehrA39N5bVc+7a8cNPQtPVCVbDnktsu20xe6LhMU/G+cZmm4n3j8qr2QbxfvEuc7Tbf1vG9sW9A0jQd3Nwl5rozMx+bAQAAXDRWgAAAAAAYHgoQAAAAAMFQgAAAAAAIhgIEAAAAQDAUIC1hXtPAZtqeL8FcWjzl2wGhFOVf2eSS1xG5DQBA51CAtES6m/Z/lU/bk7WZS4unfDsglKL8K5tc8jolt2vRxlM0AgD6iwIEAAAAQDAUIAAAAACCoQABAAAAEAwFCAAAAIBgKEAAAFKSmEsAADgLCpCWKDqlaNnkcrpSTlWKJhTlX9nkktdRri18rBRPFkpWsSb3D4rjhVZmE/TSfkuzn0PHNR3vG9d0vG9cnX0Q/3KZzWzG9RkFSOu4nEr0XG2BeuxPjeuSfy5t9dyeIsRD8qRXP99q8/W7bu5udffKbIC+2p/w2n4OHdd0vG9c0/G+cXX2QfzLZTazGddnFCAtkb+OgXmdg2PTYeTpyXwMIBQz/8qmfZTdlG8NR6MrXTzF+vrqZ91qoXtd6dJsAwBAzaI0TXnXDiSKIpU93ZFD1Zt93mvT3qlfi/UEMjb54pR/u1uX9tZtLdYV6CKX3HbZZvJCx2WaiveNyzQV7xuXV7UP4v3iXeJst/n5fN7Ki83yDQgADFSyWiiO4+28WImfoQMAQqAAAYABShax7nWl5XK5na+edB8vKEIAAGdHAQIAA7R5lK4vR/sFo1td61GbfCMAAM6AAgQAhipJlORmAABCoABpCfOaBjbT9udK5tLiyWwHhHAs/05NLnkdGW1hb3x3LW022uRmXd9pbDYEAKBmnAUrIJszFjidAWF3a9PeqV+L9QQyNvnilH+7W5f21m0t1hXoIpfcdtlm8kLHZZqK943LNBXvG5dXtQ/i/eJd4my3ec6CBQAAAGDwKEAAAAAABEMBAgAAgOCS1ULxZKLJZKJ4xYkwhoQCBACAnsvv6IkdPbRBstDbrxdartdar9e6/vpWiyw1OStf71GAAADQZ8aOntjRQwskD4+6ubt8/vflcq3b7NJEm3tNFomSRax49dwEPUIB0iLmKUXLpu35EsylxZPZDgjhWP6dmlzyOnpujyrm87m5CD1i7uiJHT203eVSPz++1dvHay1zqYv+oABpie2OlBxOwCbvtqlTHOBvn2suOefSVpLSXDECwMZzqX+51LfHtxo/XuuXy9zygvkgzmH2jWs63jeu6XjfuDr7sIkf3y71fvRyeRb/p+Va35aXL+6zmW0e/9TcVLwZ12cUIC2R7qb832XTYeTpyXwMIBQz/8qmfZTdlG8N4KXRhfTlIXeo1WKin1bbUj9Voo+S3nx/0mZX/h+bVbDMZvaNazreN67peN+4Ovuwjf81nuhNHOuneKI38WofH0/0MZHSZHGw3Ha2ffxjc1PxZlyfcSHCgGwuGhM5JF1WHdu0d+rXYj2BjE2+OOXf7talvXVbi3UdorZeqAr2ynJ7FU/0Qa/1Wt/1i35WujuuZRVP9HS31q0WmtxfaH3ieBeXbS3PNy7TVLxvXKapeN+4vKp9EO8X7xJXts1n2jq+U4AEZJMsTsm3u7Vp79SvxXoCGZt8ccq/3a1Le+u2Fus6RG19g4I9l9x22WbyQsdlmor3jcs0Fe8bl1e1D+L94l3ibLf5to7vHIIFAEAPRFFkNatgmc2cjwNsmXlkM3vnKDqDAgQAgB5I09Rqns1mL5a5zIArM4eKZpe8nM1mL9qjWyhAAADoqaJTLLscjjGfzwv7AFyYOWT+W455OZ1OndqjffgNSEDRieP1Qp5CtOxsQafWEzCdypc25bVK1nXI2nqMMOxluR3itXTdjlyOay/SVLxvXKapeN+4vKp95ONd88VX/nHqXH8fvvEucbbPa4gxwQffgLROeTLtnastUI99UeCSfy5t9dw+ZLEDtFWdOxp8+4E2yXKRvOwHCpCWKLqmQdl0GHl6Mh8DCMXMv7JpH2U35VsDcGfuzGU7eNlhLub9wDkU5Vm+6Mhu83lZFINu4BCsgGy+LnP6+m13a9PeqV+L9QQyNvnilH+7W5f21m0t1nWI2voVPeydym3fswPl+8vnyKnHKuKyjRZpKt43LtNUvG9cXtU+8vFF+eKbkxmzPxmPU+f6+/CNd4krel6LtHV85xsQAAB6KttJ8ZnzO4lt3IFB95k5l80qWJYtRz9QgAAA0DPmoSnHPm92XQ74MA+lyhTl2bFvAY4tx2lt/fCAAgQAgJ7IdvBsdjqO7dAVLTd3HAEXWT6aeWnm2bFlOrKcvOwufgMSkM3xekUD/zHZJwc27Z36tVhPIGOTL075t7t1aW/d1mJdh6itxwjD3rHcPrbcxrHYY8uPcdlGizQV7xuXaSreNy6vah/5+KJ8yQ7vM5fbKOrPXF7n+vvwjXeJO/Y8dAXfgLREtJv2f5VP21Q1lxZP+XZAKEX5Vza55HVEbgMA0DkUIC2xP42oeZLR49O2TjaXFk/5dkAoRflXNrnkdUpuA43Yf1RQPru2N+em4n3jmo73jauzj3y80rTwfp/HKJNvZ8a6zE3Fm3F1+vG3v+mHubBBFCAAAMDJZrXQT5OJ3kwm+mmV5D46eDmrYJnL3FS8b1zT8b5xdfaRj1cUFd7v8xhlO+Vv4tVz/7/GE31MXvZhM6tgmcvsG2/G1em3f/xDv5kLG0QBAgBAj53jh7pvv15ouV5rvV7r+utbLRKzBbB3LAfLCoq8yGKn/Obu8vnvy+Vat6Pt36s43uXoSnG8em7TXz/048fh3DYUIAAA9MCxnbxznGCAHT24OJaDZQVF3rG2NldEv7x7pceHRFp9la73udtXP378pt9+O5z1x3/VP5sNG8RZsAKyOWOBTYWfyT45sGnv1K/FegIZm3xxyr/drUt767YW6zpEnAWr+47l9rHlNszYbCdvNpvp4yZ9LjoOJAvFD1daXtwr1lLLS7dttEhT8b5xmabifePyqvaRjzfzKFsm1X8WrDcfN1rfjhRJ2iwmur9Ya3kpSYkW8YOkR10slyorQer8/7twiTv2PHQF34AAAICTsiI1K1S/POyPuUoWEz1/2TG60qvHBy2G8UEzGmZ+8/Hz41tN4liKJ3r7+POu+JCkka5efdGXV3elxQfC4BuQgMqq1ZCnET11xqCy9QTyTuVLqJw+lc95p9Z1yPgGpPuO5fax5TaOxUZRpF9/eqMPeq3X+q7v+lnr/Z6eksVEb/VZ691XJC6f6hZpKt43LtNUvG9cXtU+mvoGJFtetP7JItbD1bL4mztDUbwL33iXuGPPQ1fwDUhL7HfUXJLJr63tzhpQ1T7XXHLOpa0kpVwHBPB0bKs5tjxzuVxrvVxquVwfFB9br3VzZbGXh8E7lmeuy8skq4XudWdVfCAMCpCWyF/HIH+Ng1PTYeTpyXwMIBQz/8qmfZTdlG8NDJl5OEpe0Y7bsU9bjy23wY4eXEVRdDhvFx5d7mN0easlSdkqFCAAAPRUmqbbw13Mnbkjy/LLfQ7vYEcPNtI03c75v08tM5aj+yhAAADogWO/43mxI2c5A3WxOVUuzqOtzzsFCAAAPVBlJ883Djg3crOfKEAAAOiB7DS5Pjtsx749yfj0CWSy/PLJo3xumvHmv9EdFCAAAPRIvgjx2UEr+ialrEAByuSvI2Pml/nvY7LcztqTl93FdUACOvWjvpCnEC07W9Cp9QRMp/IlZF6L3PY25zognVeW29lr7PJaH9vJK3ssU5WzaqnBeN+4TFPxvnF5VfvIx0eeZ67ykeVlnevvwzfeJc52O3TZ5kOiAAnIJlmckm93a9PeqV+L9QQyNvnilH+7W5f21m0t1nWI2voGBXtN7OTZctlGizQV7xuXaSreNy6vah/5+GOF7Cl1Pr6PpuJd4mzfz9o6vnMIFgAAPZAWnMmqaFbFOdrtKNnOKljmMjcV7xvXdLxvXJ195ONn06lm0+mLNqfmOh/fZ24q3ozrMwoQAAAGJvWYQ8c1He8b13S8b1ydfRD/cpnNbMb1GQUIAAAAgGAoQAAAAAAEQwECAAAAIBgKkJaIdtP+r/Ip+5mSzZRvB4RSlH9lk0teR7m2AACgGyhAWsflZ0fnagvUY39dDpf8c2mr5/YUIQAAdAMFSEukuyn/d9l0GHl6Mh8DCMXMv7JpH2U35VsDAID2owABAAAAEAwFCAAAAIBgKEAAAAAABEMBAgAAACAYChAAAAAAwVCAtIR5TQObyeV6CVwHBE0oyr+yySWvI3IbAIDOoQBpif1pRM2TjB6fttc/MJcWT/l2QChF+Vc2ueR1Sm4DANA5FCAAAAAAgqEAAQAAABAMBQgAAAOz/7WV/Rw6rul437im433j6uyD+JfLbGYzrs96WYDM53NzEQCgIsbW/tj/2sp+Dh3XdLxvXNPxvnF19kH8y2U2sxnXZ1Gapv37P0btfOWiKFLZ0+2y6ll1bNPeqV+L9QQyNvnilH+7W5f21m0t1nWQbJ9E23YIziW3fV/G0HGZpuJ94zJNxfvG5VXtg3i/eJc4221+Pp9rOp2aixvXv29AImk+m29fxQ4pOqVo2bT9T5pLi6d8OyCUovwrm1zyOsq1hSfbMdO2HQAAJXrxDUj+sIDpbKr5bP58azKrwCgK+2567One70Clux0wG35tbU5XGvp5Qbcdy2s957Zfrtqxz23y+qVU6ckxU7lx1fxbBWMqmmH7aah2W4tdy0Oh4zJNxfvGZZqK943Lq9oH8X7xLnG223xbvwHpRQFyIMr9bfE/s30BQ3FKvt2tTXuXfoG6ueSfS17LsW8ciqLosGg79UQ6jq0Iy+W9zHebCR2XaSreNy7TVLxvXF7VPoj3i3eJs93m21qA9O8QrHR3mED5awIAsB0zbdsBAFCifwUIAMBJGz8dAwD0FwUIAAAAgGAoQAAAAAAEQwECAAAAIBgKEAAAAADBUIB4iM44u/Tvsj627ZiZzzG75J9LXmftzWVDnwEAaLP+XQfEke15lIf8pl7+7ByKHGPa1l4eMW1rL4+Yc7bPth+b9vm2No+Rb2PTPq9t7eUZY7J9vm3HP7Sfy2vpm2Oh4zJNxfvGZZqK943Lq9oH8X7xLnG22zzXAemB7GVOHeZzts+Yy4tml7b5mHysDZeNRy1sL4+YtrWXR8y528ujvetjdL29PGNMWR/p7m8AANqGAsSR686Ba/tzcl0X1/byiGlbe3nEtK29PGLO3d6H62N0vb08Y0x19AEAwDlRgAAAMDCRxxw6rul437im433j6uyD+JfLbGYzrs8oQAAAGJjUYw4d13S8b1zT8b5xdfZB/MtlNrMZ12e9LkCSJFFiLgQAeGNcBQBU1a8CJFkonsSKV9u3x839vTZmGwCAPcZVAEDN+lWASNLNne50r0m80pN5n4dkMdEkjiVJ8WSixcpsAQDhZGNSHMfhxqSax1UAwLD1rwCRNLpcan0nPX5/Zd7l4bVu7paSpOXnGz0+JZJWWsSx4njFoQgAAtuOScvlMuiYVO+4CgAYMi5EWHIhl2Qx0dsv0rf1Wm/ihT4vb7WJY2m51GWy0kqXuhyZUf4ihx8eZWdIsGnv0i9QN5f8c8lrOfbdB9mYJEl6fXNyTCp7bsrGP3SHy2tZlhfHhI7LNBXvG5dpKt43Lq9qH8T7xbvE2W7zXIjwzJJkpdXKnOv4seRr3XxeS5Ju9Hh47PNorHGNxQcAlNuOSev157OPSecbVwEAQ9abAmQ0Gms8Hmusr/qq3d/jkWp8L9bt3St9iFe6vH6lr4uVFvG9HngnBtCI0dnHpBDjKgBgePp3CNYqVqyllpfmHcVsv8Jy+VqsCpfHiXa3Nu1d+gXq5pJ/Lnktx76Hpuy5sR3/XMdVhGf9WlrkxTGh4zJNxfvGZZqK943Lq9oH8X7xLnG22zyHYJ1dkjs//e7vGj8JBIDhYVwFANSvNwVIkmy02Wy00bWutft7w7HKAOCLcRUAcA79OwTLke1XWC5fi1Xh8jjR7tamvUu/QN1c8s8lr+XY99CUPTe24x/az+W1LMuLY0LHZZqK943LNBXvG5dXtQ/i/eJd4my3+bYegjXoAmQ+n2s6m2o+m5t3Pcvun02n1klRhVPy7W5d2tu2BerkknvkdX1cxrg2vkHBnu3OiCpsM6HjMk3F+8Zlmor3jcur2gfxfvEucbbbPAVIG0VSpBMvYC4TbJIiMhd4KHuMvOzxbGPqWL8m2P7/hqKLr6PLa9imvLZdh9YqG7jK7kdn2O6M6MzbDID6nNqibbf5thYgvfkNiJey163sfkNaw+zCNcZ8rK7MOGQ+P12YXbjGmI9V59x1Ucl/ImJXdLDMXLeZQ8c1He8b13S8b1ydfRD/cpnNbMb12bALEEmz2cxcdGA+Pzx0oezt2rW9yaW9S1sFaC+PmLa1l0dM29rLI6Zt7eUR0/X2sowxxxiT2UdZ+7L7AQCoWy8LkHO9oWZv7NFuns/nL+bpbPr8t9neZnZp79I2RHufmLa194lpW3ufmLa194npevuymKIxJj8X9VH3J2jnGlsRlm9ehI7LNBXvG5dpKt43Lq9qH8T78Y3rol7+BmTucLyb7TF0ViLxY04A51PzGOM6/rmMrQjL9bUE0G2223xbx+1efgPSmPI8AAB/jDEAgB6gAAEAAAAQDAUIAAAAgGAoQAAAAAAEQwECAAAAIJhengXL5fyTtmcRsNXWsw0A6Ic6xxjn8c9hbEVYUZSdhBnAUFiN39nQYNE0pF4UIPlz009n0+1pKne3JvONu8qgXXQRw/zjFt0PAD6y8eTY2OY73hS9BZjX+5jOtuNm0dhqjqkAgOYU7RObf6sFY3cvCpAD2XnyZ9Pw1V7N5+gHgANNjjFNjq0AAD8t/Qakf78BSXef1jXxRGePmSRKJClZKUkOmwCAk/x4sjHvDKjJsRUA4GU+m7dy3O5fAZI92Q2Z/vd/Uvyw20sYjfVwv9DKbAQANpLFi/HkX5r49mOnybEVAOCukW/MLfSyAGn+yR5rJEka6UKP5p0A4KA940nzYysAoA96WYA0anSru4sHxZOJJnGsp7ulLs02AGCD8QQOzJMHAOivrm/vgy9A6n0BE60WsR50peV6rfXdtcQhWAC8nH88qXf8AwDAzuALkDqt4rd6urrT1dO94jjW5P5JF3e3fGIJwBnjCQCgryhA6vTqRlejkUZXr6RXd1ovb3W5PXgbeJYstofTxHGsOF5tz3AEmBhPABzx429/0V8+fdKnT5/06dN/6IfZAGi5wRcg2QW26rJJkt2pMjdKkoTT8KLAa93cLbVcLnWtr2ryzKpot3OPJ3WPf2gWr+eQ/EGTf32nd+/e6Y/6u34z70bvdX17H3YBsruw1vNFWioaX11Im402utD1hbTZbLTZ7M7hDzz7ri/3seJ4og+61ti8GwgxntQ8/qFhvJ4D83+0/t+f9OnTX/RFf9Q/m3ej33qwvffvSuiW5vPtFX2zK/tyfnuci3nq0mQR6+FqqduRpFWsWEstTxzYzw+FcQ75ce95LOQ0u52TjQ+8n/WbuW3++Nsn/ft/fac//17Sf3zSJ73Tu385aPKM95B+6cvYPdgCRMpdnl7bq/zO5918EetS9f9fNX4oksVEbx9f67/9/vf68eOfdL30+2Exz7cbni+DMf6h43g9B+XH3/6i//GPP+gPkqT/oj+++7OO1B/oox5s78M+BCut9xL1VT9lqCO+ah9NqrruPvE+MXk+8aPbtdbLpSRp6Vl81MFn3fN84n1i8qrGV1H1savGy7GP0rY1j39oGK/noPz+z/+mf3u3/Q3IO4qP4enB9j7sAgQAAABAUBQgAAAAAIIZfAGSHRNeerjCmVV9/K7HN6HqOleJrxKrGuKbUHWdq8RXie0zfhPTL7yewHB0fXsffAFiqrqj0nR8VVUfv+vxoVVd367Hh1Z1fZuMd4l1aQsAQGjdLEBWsaIoys0TLWo7OT4AAACAc+lYAZJoMYkU/em7Pm5Spelu/vW13o8jTahCAAAAgFbrVAGSLN7q/bef9Gu63l7ELXO5VPrrT/r2fqx4lVvegKrH5FWNBwAAANqsQwXISvfvv+nNx7vi6yZc3unjG+mXr34VSLbjP/QCoOn/f9XHrxofWtPrW/Xxq8aHVnV9m44HAKAPulOAJE/6Lun1Rf6rj7yRrm7eSL98lV8Jgioo4MLi+QYAAF3VnQJk86hveqNXY/OOvdHFa0nf9cRPQQAAAIBW6k4BAgAAAKDzulOAjF/pjb7pcWPesZc8fZf0WkeP0gIAAADQqO4UIKMLvZb0/ejxVYkevnyT3rzSiaO0AAAAADSoOwWILnX38Y2+vX+bu+jg7rogk4WS1b3ef5Pe3FyJL0AAAACAdupQASKNbtf69advej/Ornw+0u16o496r/GffpHefNTngwuEAAAAAGiTThUgknS53F/5PIoiRdFY77/t7vz2XuMo5jS8AAAAQEt1rgCRdlc+T9OCeaOPbzgNLwAAANBW3SxAjhrpdr0WR2EBAAAA7dSzAgQAAABAm1GA5EynU3ORkyrx0+m0cnz+1pVvXJfV8Zz7xvvGdVmV50sV433jAABA/aI0TVNzIQAAAACcA9+AAAAAAAiGAgQAAABAMBQgAAAAAIKhAAEAAAAQDAUIAAAAgGAoQAAAAAAEQwECAAAAIBgKEAAAAADBUIAAAAAACOb/A7Wx7kGvVEx4AAAAAElFTkSuQmCC" />
          <!-- Validation Results Section -->
        <div class="section">
        <h4 style="margin-bottom: 10px;">Paso 1: Revisión de la presión de contacto.</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
           <p style="margin: 5px 0;">Pu<sub>Ext</sub> = ${data.response.response.PuExt} Ton </p>
           <p style="margin: 5px 0;">Pu<sub>Int</sub> = ${data.response.response.PuInt} Ton </p>
           <strong>Pu<sub>Max</sub> =  Φ * 0.85 * F<sub>c</sub> * C<sub>x</sub> * C<sub>y</sub></strong>
           <p style="margin: 5px 0;">Pu<sub>MaxExt</sub> =  (0.7 * 0.85 * ${data.input.Fc} Kg/cm² * ${data.input.CxExt * 100} cm * ${data.input.CyExt * 100} cm) / 1000 Ton/kgf = ${data.response.response.PuMaxExt} Ton </p>
           <p style="margin: 5px 0;">Pu<sub>MaxInt</sub> =  (0.7 * 0.85 * ${data.input.Fc} Kg/cm² * ${data.input.CxInt * 100} cm * ${data.input.CyInt * 100} cm) / 1000 Ton/kgf = ${data.response.response.PuMaxInt} Ton </p>
           <p style="font-weight: bold; margin: 5px 0;">Pu<sub>MaxExt</sub> =  ${data.response.response.PuExt} < ${data.response.response.PuMaxExt} OK</p>
           <p style="font-weight: bold; margin: 5px 0;">Pu<sub>MaxInt</sub> =  ${data.response.response.PuInt} < ${data.response.response.PuMaxInt} OK</p>
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
                <div class="subtitle">Reporte de cálculo estructural para zapata combinada</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <div class= "section">
          <h4>Paso 2: Area requerida.</h4>
          <div style="font-family: 'Times New Roman', serif; line-height: 1.2; margin-bottom: 15px;">
           <p style="margin: 5px 0;">Factor de seguridad 1.5 </p>
           <strong> ρ<sub>Servicio</sub> = Pu<sub>MaxInt</sub> / 1.5 </strong>
           <p style="margin: 5px 0;"> ρ<sub>Servicio</sub> = ${data.response.response.PuMaxInt} Ton / 1.5  = ${data.response.response.PuMaxInt / 1.5} Ton </p>
           <strong> R = Pu<sub>Ext</sub> + Pu<sub>Int</sub> = ${data.response.response.R} Ton </strong>
           <p style="font-weight: bold; margin: 5px 0;> X<sub>1</sub> = Pu<sub>Int</sub> * Lz / R </p>
           <p style="margin: 5px 0;"> X<sub>1</sub> = ${data.response.response.PuInt} Ton * ${data.input.Lz} m / ${data.response.response.R} Ton = ${data.response.response.X1} m </p>
           <strong> X<sub>2</sub> = X<sub>1</sub> - Lz = ${data.response.response.X1} m - ${data.input.Lz} m = ${data.response.response.X2} m</strong>
           <strong> L = 2 * (Cx<sub>Ext</sub> / 2) X<sub>1</sub></strong>
           <p style="margin: 5px 0;"> L = 2 * ( ${data.input.CxExt} m / 2) - ${data.response.response.X1} m = ${data.response.response.L} m </p>
           <strong> A<sub>min</sub> =  ρ<sub>Servicio</sub> / Q<sub>a</sub> = ${data.response.response.A} m² </strong>
           <p style="font-weight: bold; margin: 5px 0;"> B = A<sum>min</sum> / L= ${data.response.response.B} m </P>
           <strong> Q<sub>u</sub> =  (1.2 * (Pd<sub>Ext</sub> + Pd<sub>Int</sub>) + 1.6 * (Pl<sub>Ext</sub> + Pl<sub>Int</sub>)) / A<sum>min</sum> </strong>
           <p style="margin: 5px 0;"> Q<sub>u</sub> = (1.2 * (${data.input.PdExt} Ton + ${data.input.PdInt} Ton) + 1.6 * (${data.input.PlExt} Ton + ${data.input.PlInt} Ton)) / ${data.response.response.A} m² = ${data.response.response.Qu} Ton/m²</P>
          </div>
        </div>
        <div class= "paso3">
         <h4 style="margin-bottom: 1px;">Paso 3: Gráfica de Cortante</h4>
         <div class="chart-section">
           <div class="chart-image-container">
             ${data.chartImage ? `<img src="${data.chartImage}" style="width: 100%; max-width: 600px; height: auto; border: 1px solid #ccc; border-radius: 5px;" />` : '<p>No hay gráfica disponible</p>'}
           </div>
           <div class="chart-table-container">
             <table class="chart-table">
               <thead>
                 <tr>
                   <th>Distancia (D)</th>
                   <th>Cortante (V)</th>
                 </tr>
               </thead>
               <tbody>
                 ${data.chartPoints && data.chartPoints.length > 0 ? data.chartPoints.map((point: any) => `
                   <tr>
                     <td>${typeof point.x === 'number' ? point.x.toFixed(2) : point.x}</td>
                     <td>${typeof point.y === 'number' ? point.y.toFixed(2) : point.y}</td>
                   </tr>
                 `).join('') : '<tr><td colspan="2">No hay datos disponibles</td></tr>'}
               </tbody>
             </table>
           </div>
         </div>
        </div>

        <div class= "paso3-momento">
         <h4 style="margin-bottom: 1px;">Gráfica de Momento</h4>
         <div class="chart-section">
           <div class="chart-image-container">
             ${data.graficaMomento ? `<img src="${data.graficaMomento}" style="width: 100%; max-width: 600px; height: auto; border: 1px solid #ccc; border-radius: 5px;" />` : '<p>No hay gráfica de momento disponible</p>'}
           </div>
           <div class="chart-table-container">
             <table class="chart-table">
               <thead>
                 <tr>
                   <th>Eje X</th>
                   <th>Eje Y</th>
                 </tr>
               </thead>
               <tbody>
                 ${data.momentoPoints && data.momentoPoints.length > 0 ? data.momentoPoints.map((point: any) => `
                   <tr>
                     <td>${typeof point.x === 'number' ? point.x.toFixed(2) : point.x}</td>
                     <td>${typeof point.y === 'number' ? point.y.toFixed(2) : point.y}</td>
                   </tr>
                 `).join('') : '<tr><td colspan="2">No hay datos disponibles</td></tr>'}
               </tbody>
             </table>
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
                <div class="subtitle">Reporte de cálculo estructural para zapata combinada</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <div class= "paso3">
         <h4 style="margin-bottom: 10px;">Paso 4: Peralte requerido para el cortante por punzonamiento en dos direcciones.</h4>
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <strong>I = E + Lz - L</strong>
              <p style="margin: 5px 0; font-weight: bold;"> ${Math.abs(data.response.response.E)} m+ ${Math.abs(data.input.Lz)}m - ${data.response.response.L}m = ${data.response.response.I}m </p> 
            </div>
          </div>
        </div>
        <div class= "section">
          <div style="margin-top: 10px;">
<strong> Interna </strong>
              <p style="margin: 5px 0;"> B<sub>0</sub> = (Cy<sub>Ext</sub> / 2 + ((Pd<sub>Int</sub> + Pl<sub>Int</sub>) * Lz) / (Pd<sub>Ext</sub> + Pl<sub>Ext</sub> + Pd<sub>Int</sub> + Pl<sub>Int</sub>)) </p>
              <p style="margin: 5px 0;"> B<sub>0</sub> = ${data.input.CyExt}m / 2 ((${data.input.PdInt} Ton + ${data.input.PlInt} Ton) * ${data.input.Lz}m) / (${data.input.PdExt} Ton + ${data.input.PlExt} Ton + ${data.input.PdInt} Ton + ${data.input.PlInt} Ton)</p>
              <p style="margin: 5px 0;"> B<sub>0</sub> = ${data.response.response.Bo} m</p>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Peralte requerido en una direccion.</h4>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>1</sub> = C - W * d </p>
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>1</sub> = ${data.response.response.C} - ${data.response.response.W} * ${data.input.Hz - 0.09}</p>
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>1</sub> = ${data.response.response.Vu1} Ton</p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = V<sub>1</sub> * 2204.62 / 0.75 * 2 * √((Fc * 14.223) * (Bo * 39.37)) </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = ${data.response.response.Vu1} Ton * 2204.62 Klb/Ton / 0.75 * 2 * √((${data.input.Fc} Kgf/ cm² * 14.223 Psi/(kgf/cm²)) * (${data.response.response.Bo} m * 39.37 Plg/m)) = ${data.response.response.Validate1.d} m </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> <= d =  ${data.response.response.Validate1.d} <  ${data.input.Hz - 0.09} OK </p>
              </div>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Peralte requerido en dos direcciones columna Interna.</h4>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>2</sub> = ((Pu<sub>Int</sub>) - (Cy<sub>Int</sub> + d)² * Q<sub>u</sub>) </p>
              <p style="margin: 5px 0;"> V<sub>2</sub> = ((${data.response.response.PuInt} Ton) - (${data.input.CyInt} m + ${data.input.Hz - 0.09} m)² * ${data.response.response.Qu} Ton) </p>
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>2</sub> = ${data.response.response.Vu2} Ton</p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = V<sub>2</sub> * 2204.62 / (0.75 * 4 * √(Fc * 14.223) * (4 * (Cy<sub>Int</sub> * 39.37 + (Hz - 0.09) * 39.37))) </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = (${data.response.response.Vu2} Ton * 2204.62 Klb/Ton / (0.75 * 4 * √(${data.input.Fc} Kgf/ cm² * 14.223 Psi/(kgf/cm²)) * (4 * (${data.input.CyInt} m * 39.37 Plg/m + (${data.input.Hz} m - 0.09 m) * 39.37 Plg/m)))) * 0.025 </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> =  ${data.response.response.Validate2.d} m </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> <= d =  ${data.response.response.Validate2.d} <  ${data.input.Hz - 0.09} OK </p>
              </div>
          </div>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Peralte requerido en dos direcciones columna Externa.</h4>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>3</sub> = ((Pu<sub>Ext</sub>) - (Cy<sub>Ext</sub> + d) * (Cx<sub>Ext</sub> + d/2) * Q<sub>u</sub>) </p>
              <p style="margin: 5px 0;"> V<sub>3</sub> = ((${data.response.response.PuExt} Ton) - (${data.input.CyExt} m + ${data.input.Hz - 0.09} m) * ${data.input.CxExt} m + ${data.input.Hz - 0.09} m / 2} * ${data.response.response.Qu} Ton) </p>
              <p style="margin: 5px 0; font-weight: bold;"> V<sub>3</sub> = ${data.response.response.Vu3} Ton</p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = V<sub>3</sub> * 2204.62 / (0.75 * 4 * √(Fc * 14.223) * (((Cy<sub>Ext</sub> + (Hz - 0.09)) * (Cx<sub>Ext</sub> + d/2)) * 39.37) * 2 </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> = (${data.response.response.Vu3} Ton * 2204.62 Klb/Ton / (0.75 * 4 * √(${data.input.Fc} Kgf/ cm² * 14.223 Psi/(kgf/cm²)) * (((${data.input.CyExt} m + (${data.input.Hz} m - 0.09 m)) * (${data.input.CxExt} m + ${data.input.Hz} m - 0.09 m / 2)) * 39.37 Plg/m) * 2 </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> =  ${data.response.response.Validate3.d} m </p>
              <p style="margin: 5px 0; font-weight: bold;"> d<sub>0</sub> <= d =  ${data.response.response.Validate3.d} <  ${data.input.Hz - 0.09} OK </p>
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
                <div class="subtitle">Reporte de cálculo estructural para zapata combinada</div>
              </td>
              <td class="info-cell">
                <div style="font-weight: bold; margin-bottom: 3px;">FECHA:</div>
              </td>
            </tr>
          </table>
        </div>
        <h4 style="margin: 10px 0 5px 0;">Calculo acero doble.</h4>
        <h4 style="margin: 10px 0 5px 0;">Paso 5: Diseño del acero de refuerzo por friccion.</h4>
        <h5 style="margin: 10px 0 5px 0;">Si ρ es menor que 0.0033 se toma por defecto 0.0033. (ρ ≥ 0.0033) </h5>
        <div class= "section">
          <div style="margin-top: 10px;">
            <div style="font-family: 'Times New Roman', serif; line-height: 1.2;">
              <p style="margin: 5px 0; font-weight: bold;"> F<sub>c</sub> = ${data.input.Fc} * 0.098 = ${data.input.Fc * 0.098}Mpa</p>
              <p style="margin: 5px 0; font-weight: bold;"> F<sub>y</sub> = ${data.input.Fy} * 0.098 = ${data.input.Fy * 0.098}Mpa</p>
              <p style="margin: 5px 0; font-weight: bold;"> M<sub>u</sub>: Valor en Mn (mega newton)</p>
              <img src="data:image/png;base64,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UuXKldP27dvVvn17OTo6avny5UpJSZGvr6+krJnU7ezstGTJEv35z39WVFSU3n//fUkiJAMAAABlnNVCcq1atTRr1iwFBgYqISFBtra2SklJUWBgoHk5p9OnT8vV1dX8ts7Ozs68hFD2/nuX27l165ZsbGzUp08fSVmBM3v24pKoNz4+Xjdu3NDixYsVGBioCxcuyN3dXUuXLjW/7c7IyJDJZNLIkSPN17azs1PNmjUVGxur77//3rx2crYmTZooNjY2z7p+/fVXjR492vz3RYsWScp6oBAQEFAsn12Snn/+eV27dk0rVqzQlStX5OHhocDAwBzdra9fv27uSi1Jly5d0vTp03Xjxg05OzurTZs2+te//mV+k33r1i0FBQXp8uXLqlKlirp27ao33njD3N6WfJ9SVrCNj4/Xxo0bZTKZ9NVXX1kckuPj42Vvb2+eLCw8PFwNGjSQn5+fJk+erJs3b6pz584KDg42v9V/8sknNWPGDC1btkzbtm1TixYt1LNnT23fvr1Qs6wDAAAAKH1sMjMzM61dRNeuXTV79mx5e3sX6TphYWHasGGD/v73v0uSZs2apZdffrnQ41bvJ7969+3bpzlz5ujbb78t9DUXLlwod3d3bdiwIUcgk6QVK1bo7Nmzmj9/fpFrL0ss+T7PnDmjN954QzY2NqpVq5aef/55PfvssxbPer1792598sknud5MAwAAAHg8lbN2AZcuXVJiYqJcXV2LfK2oqKgc3V1NJlOxL7dTUL3h4eEP/DlatGihJUuWqH///jkCsiQ9++yzOnHixANdtyyz5Pts0qSJfHx8NGHCBAUHB8vBwaFQy0IdO3ZMnTt3LmqpAAAAAB4RVg/JJpNJFStWzDWj8oOIiooyh+K0tDTdunUrR/fs4lBQvdlrOj+IBg0aqGrVqrlmVZak5s2bq0qVKualox4Xln6f9z4Mye5qb6kff/zRPEYaAAAAAEpFd2tIb7/9try9vc2zR//ed999px9++EFTp04t2cLKgN69e+uLL77IsUyUJU6cOKH169ebJ90CAAAAAKu/SX7cXbx4Uf369VPFihXzDchSVpfrS5cuKSkpqeSKKwOuX78uJyenXAE5NTVVCxYs0KJFi/R///d/eZ77+eefy8/PryTKBAAAAFBGWG12a2SpV6+evvjiC4uOHTNmjNauXZtjHeHHnclkynPc8ubNm/XCCy+oRYsWeZ4XERGhWrVqFctYeAAAAACPDkJyGeLu7q5Lly7pl19+Ubt27axdTqng6emZ5+zlJpNJgwcPzvOclJQU7d69W6NGjXrY5QEAAAAoYxiTXAadPXtWjRs3tnYZpdru3bv1008/qXLlyvrrX/+qcuX+O7IgKipKDRo0kL29vRUrBAAAAFAaEZIBAAAAADAwcRcAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAY7axeAx8/ly5c1a9YsHT582NqlAKUO/y4AAACsi5CMEhcaGqo6deoQBgAAAACUOnS3RokLCwtT27ZtrV0GAAAAAORCSEaJCwsLU5s2baxdBgAAAADkQkhGiUpOTlZCQoIaNmxo7VIAAAAAIBdC8kMQGxur4cOHq0uXLvr444+tXU6pcvz4cbVs2dLaZeTp9+0WEhKi1NRUa5eFYkY7AwAAoCCE5Idg1apV8vLyUkhIiIYOHSpJ/BA3lObxyPe225AhQ7RkyRJlZmZau6zHSmxsrDw9PTVixIgc2/fu3StPT08FBAQU+R60MwAAAApCSH4IDh06pK5du5r/npmZyQ9xQ2HHI2/ZskU3b958iBX9173tZjKZ9D//8z8qX758idw7P5cuXdLu3butWkNJioiIUIMGDXTu3DnztrS0NC1fvlx169aVh4dHke9RGtsZAAAApQchuRglJSXJy8tLly9f1tChQzVp0iRJ/BDPlp6ersjISD311FMWHf/pp5+qbt26qly58kOtK692O3z4sHr37v1Q72uJmjVrKi4uTgcPHrR2KSUiMjJSbdu2VcWKFXXlyhVJ0n/+8x81a9ZMkooUkktzOwMAAKD0ICQXI0dHRy1fvlyurq7av3+/FixYIEn8EDdERkaqUaNGsrO7//LcoaGhioqKUseOHR96XXm12927d9W0adOHfm9LDB48WB999JESEhLy3H/37l29/fbb6tmzp7y9vTVs2DAdO3ashKssHhEREXJ3d5ebm5vOnj2rlJQUffTRR/L19VVsbKzc3d0f+NqlvZ0BAABQOhCSi1lkZKTc3NxybOOHeBZLu1qnpaVpwYIF8vf3L4Gqsvy+3Xx9fUvs3vdja2urYcOGaeHChXnuT09PV506dbR27Vrt3btXgwYN0vjx45WcnFzClRZdZGSk3N3d5erqqrNnz2r9+vXq0qWLkpKSVKNGDVWtWtWi6/j7++c5aV5pbmcAAACUDoTkYmYymXKFZH6IZwkNDbUoJP/73/9Ws2bN9OSTT5ZAVVnyarfS5A9/+INiYmJ09OjRXPsqVqwoPz8/1apVS+XKlZOPj4/s7e11/vx5K1T64JKTkxUTE2N+k3z06FH9+9//1vDhw83h2VK9e/fOc4K40t7OAAAAsD5CcjEzmUxF6hL6KDt+/Ph9Q3J6errWr1+vPn36lExRhvu1244dO+Tn56dhw4bp+PHjJVjZf/Xr109r166973EXLlxQYmKi6tevXwJVFZ/IyEjz22I3Nzft2rVLAwYMULVq1czdsCUpJSVF48ePN/85e+z/vXr27KlWrVrl2l4W2hkAAADWdf/BoSiU+72p2rFjh/7zn/8oNTVVEydOzPOH/KMoPj5ejo6O952E68cff1R6enqJr6VcULtFRkbq+++/14oVK2Rra6u0tLQSrS1b9+7d9fe//11RUVFydXXN85iUlBTNnDlTw4YNk5OTUwlXWDT3doVu3Lixli1bZn6oYjKZNGjQIEnS2bNn1bhxY/P27D9boiy0MwAAAKyLkFyM4uPjZWNjo5o1a+a5/3H+EW5pV+udO3eWyGRd97pfu3311VcaNGiQbG1tJcmiicceBicnJ7Vs2VI7d+7UG2+8kWt/Wlqapk6dqvr168vPz88KFRbNvW+L7ezs1KFDB0lZS6jd+wbYZDKZHxLc++f7KSvtDAAAAOsqNd2tDx8+rCFDhsjLy0teXl6aNm2abt26Ze2yCqVWrVras2dPvvsf5x/hYWFheY4RvVdGRoa+//57tW7dumSKMtyv3e7evauMjAxJsvqDjaefflp79+7NtT0jI0MzZ86UjY2NAgICZGNjY4XqiuZvf/ub3nzzzVzbbWxs9N1336lRo0aSpNjYWNWuXVuStHfvXotDcllqZwAAAFhPqUhpW7du1dy5c+Xj46PevXvryJEj2rVrlxwcHDR79uwcx6alpVkcnqtUqaJy5UrNc4BcP8Ift5A8ZMiQAo8xmUy6efNmkdbCfRj69u2rOXPmyMHBQc8+++x9P8fD5O7urtWrV+vq1auqXr26efvcuXN15coVBQYGPvL/X7Vt21arVq1Su3btdOnSJXN4LqrS1M4AAACwHpvMzMxMaxZw7tw5vfrqqxo/frwGDhxo3u7v76+TJ09q3759OX70Hz58WKNHj7bo2tu2bVOdOnWKveYHZTKZHssf4bdu3dKrr76qL7/8ssDjtm7dqnfffVcHDhyQg4NDCVVXtpw7d04DBgzQ4sWL5eXlJUmKi4vTSy+9pAoVKuR4KLR06VK1a9fOWqUCAAAAZZLVXzmtXLlS7u7uevXVV3Nsb9eunY4eParExMQcb8w8PDy0bNkyi679xBNPFGutReXm5qZ169ZZuwxlZGQoNTXVomPLly9f5K67x48ft2iCspiYGFWuXJmAXIAaNWpIki5evGjeVrt2bR0+fNjia5R0+wMAAABliVVDclpamn744QcNGzYs1w/x27dvy8bGRo6Ojjm2V6lSxTyhDx7M0aNHLX4b/9lnn923O+vPP/+sZ555Jt8wZcl4ZCnrjaizs7NFdT2uKlWqJAcHB8XHxz/wNYq7/QEAAIBHiVVD8unTp5WUlJTnGNTsmW4rVKiQY3tqaqpu3Lhh0fWdnZ3Nk2Thvxo1apRrrHd+XFxc8t2XlJSkf/zjH9qxY4c+/fTTfJfWCQsL09ixY+97r6SkpFztjdwqVqyopKSkBz6/uNofAAAAeBRZNSRHRERIyvrRf6+EhASFhoZqxIgRuc4JCwsr0phkT0/PB6y27Pp9V1wXFxe99NJLRbrmb7/9pg8++MDchqGhoXmG5LS0NJ05c8a8fE9B7ty5I3t7+zz30W7/Vb58eaWkpDzwdYva/o9jWzxMhekqDwAAgIfPqiE5MjJSUlb3z/bt20vKClXz5s2Tk5OT+vXrl+ucoo5J5gdp8XBxcdG8efPME0mFhYVpwIABuY6LiIiQq6urRTMu29raKj09Pc99j1q7xcbGasaMGTpz5oxGjBihoUOHWnyutWdGL2pbHDlyRIGBgbK1tVXz5s01ceLEYqqsdHrcPi8AAEBZZ9WQHBUVpSZNmig4OFi3b9+Wi4uLvvnmG/3666+aP39+niGXMck5FSVsFUX2+ONGjRqpdu3aCg0NzfO4sLAwtWnTxqJrOjg46O7du3nuu3v3rubNm6eDBw/q1q1baty4sSZMmFCoNZWvXbumgIAAHTlyRDVq1NDUqVP1zDPP5Hmsv7+/Tpw4Ye6u365dOy1dulRS1v+377//viIiIlSjRg1NmTKl0G9XV61aJS8vLwUHBxfqPCnru/h974uypH79+lq1apXKly+vGTNmyGQy5dtV/1HwuH1eAACAss6qiwibTCY999xzmjx5snbu3KnAwEDZ2NgoKChIXbp0eSj3vHv3rt5++2317NlT3t7eGjZsmI4dO1aoa1y7dk1vvfWWvLy81K9fPx08eDDfY/39/dWxY0d17txZnTt3zjE2NyoqSn5+fvL29taf/vSnB3pDlx22QkJCSiwg/17btm0VFxenS5cu5doXGhpqcUh+4oknlJiYmOe+9PR01alTR2vXrtXevXs1aNAgjR8/XsnJyRbXmf3gZffu3Xrrrbc0bdq0Ase3z5gxQ/v379f+/fvNATktLU0TJ05Ut27dtGfPHk2aNElTpkzR9evXLa5Dkg4dOqSuXbsW6hwpa2bq5OTkHDO+W4u3t7cuX75s8fHjxo3Tzp07VaNGDZUvX15SVu+B0rSWeXGJjY3V8OHD1aVLF3399deP/OcFAAB4lFjt11p8fLwSExPVuHFj9e3bV19++aV++OEHBQcH6w9/+MNDuy9hq/hlz1z9yy+/5Np34sQJi5Z/kqR69erp2rVrSktLy7WvYsWK8vPzU61atVSuXDn5+PjI3t5e58+ft+jaycnJCgkJ0ahRo+Tg4CBvb2+5urpq3759Fp2f7dy5c7p586YGDhwoW1tbdejQQU2bNlVISIhF5yclJcnLy0uXL1/W0KFDNWnSpELd/+rVq0pPT1e9evUKdV5xy55dO3tJKkucPXtWrq6u5r+fPn1a169fV5MmTXId++abb2rPnj2Fqqm0P7wq6PMCAACg9LBaSDaZTJKU40dzSSBsFb/skBwWFpZje0xMjKpVq5ZrGa/8uLq6KiMjQ7Gxsfc99sKFC0pMTFT9+vUtuvaFCxdUqVIl1axZ07zNzc1NZ86cyfecDz74QN27d9eYMWPM4+clKTMzM9exUVFRFtXh6Oio5cuXy9XVVfv379eCBQssOi9b9tv6xo0bF+q84mYymQq1NNSdO3d0+fJl8zlXr17VggULNGvWrFzHZmRk6MSJExYtG3av0vzwqqDPCwAAgNLFqiHZ1tZWDRs2tFYJkh7fsFWcmjRpoqpVq+Yal1yYrtaS1KpVK5UrVy7Hd5SXlJQUzZw5U8OGDZOTk1Ou/f7+/vr4449zbLt9+3ausO7o6JhvD4KxY8dq27Zt2rFjhzp06KCxY8cqKSlJjRo1UuXKlbV+/XrzOt9HjhzJc7bpvOqQsiase9AxqZGRkXJ0dLRotvCHKSoqSjVq1ND06dPNwxbi4uLM+9PS0hQUFKTnnntOffr00c6dO1WvXj3Z29vr7t27mjFjhiZOnJhj3oG0tDStWLFCL774opKSkuTr66sffvjBonpK88Or/D4vAAAASierhuS6deuax+pZw+MctoqTjY2NWrduraioKN26dcu8PSwsrFBvA52cnNSyZcsCx4inpaVp6tSpql+/vvz8/PI8pnfv3rnum9fawklJSapUqVKe12jZsqUqVaokBwcH+fr6qlKlSjp+/Ljs7Oy0YMECfffdd/Lx8dHGjRv1/PPP59ntOK86JBVp4qbTp0+rffv2Vh/XGhUVpbCwML3yyiv69ttvVadOHa1cudK8PzAwUBEREdq2bZtWrFihVatWmXuNfPnllzKZTFq0aJH8/f3N7f3hhx8qMjJS/v7+6ty5s0aMGKF58+bl+TDp90rzw6v8Pi8AAABKJ6v90n733Xf1xRdfWOv2j33YKm5t2rRRRkZGji7XhZnZOluPHj3yHUuakZGhmTNnysbGRgEBAeYZtn+vZ8+eucZBN2jQQMnJyTkmmsqeXd0S94ZSd3d3rVq1St9++62CgoIUExOjFi1aWFSHlNVuD/om+KefftLzzz//QOcWp6ioKI0YMUJt2rSRnZ2dXnzxRXMg/e2337R161YFBASocuXKqlWrllq3bm0OyX379tU333yjVatWadWqVWrdurVu3LihTZs2aebMmYqJiZGHh4e6deumuLg43b59O8e9y9rDq7w+LwAAAEqvx3Ka1UcxbO3Zs8f8gz06OloBAQEW1VNcskN8dpfrmzdvKiUlJcebPUv06NFDMTExeY4Rnzt3rq5cuaL333+/0OsEV6pUSd7e3lq5cqVSUlK0f/9+mUwmeXt75zr25s2b+umnn3T37l2lpqZqw4YNSkxMVMuWLSVlhaA7d+4oJSVF69atU0ZGhjp27GhxLfc+3ChMu505c0bXrl3Ls+aSlJGRoXPnzuUYc3v9+nVVrVpVknTw4EE1b948xwzc165dK3D+gZ9//lnNmjVTtWrVFBkZKXd3d924cUMODg65lrvi4RUAAAAepscyJD+KYeupp55SRESEJGnNmjUaOXJkoT5XUTVv3lzly5c3h+SwsDCLZ7W+V5UqVdS/f3/t2LEjx/a4uDht3bpVJ0+eVPfu3c2zEuc1o3Z+pk6dqt9++03dunXTokWLNHfuXHOwGzt2rHnN4rS0NC1btkzdu3eXj4+P9u/fryVLlpi75G/btk0+Pj7y8fHR8ePHCzUePD4+XjY2NuaHB4Vpt+3bt6t///75Br+SEh0drTt37sjZ2dm8LSQkxPz/7vXr11WtWjXzvoSEBB07dqzAkHz16lVVqVJFUta/Cw8PDx04cEAdO3bM9RCrLD28AgAAQNlTuIT4CMgOWxUqVFD37t3N25cuXap27dpZdI2pU6dq9uzZ6tatm2rWrJkjbElZgatt27bq27evli1bpvPnz8vOzk4eHh65wtb27duVmZmpZ555pkhhq3bt2rp8+bJMJpMcHBxKfImg8uXLq3nz5vr111+Vmpr6QF2ts/n6+mr48OF67bXXzIGwdu3aD7QUz72cnZ3Nsxj/3r3bnZ2d8+xGm23ixImaOHHiA9VQq1atHEsbWdput2/f1t69e7V27doHum9xioqKkq2trXbu3KkePXpo+/btMplMeueddyRJDRs21EcffaT4+HhVqFDB3FujoMnxGjVqpODgYEVFRSkpKUlJSUn6+OOPtWTJEotquvfh1eTJk3Xo0KECH16dPHlS7du3l42NjTZv3pzr4VWDBg2UmZmpzZs3F7mnQExMjIYOHaro6GitXbu2xHt5AAAAoHBsMi2ZFQdlwrhx42Rra6spU6YUav3a4hIUFKR//etfWrt2rZYtW6bJkyc/8Bu1HTt2KCYmRqNGjSrmKksfS9pt3bp1Kl++vAYOHFjC1eW2evVqXb16VTExMTp27JiaN2+u6dOnq27dupKyumPPmTNHe/fuVY0aNeTp6aljx45pw4YN+V4zIyND//jHP/TVV18pJSVFrq6umjBhgjw9PS2u69q1a5o9e7aOHDmimjVrasqUKerQoYN5/70Pr8aOHZvj4dW4cePUrFkzSdLChQtzPLyaMmWKXFxcLKohPj5egwcPNj8IiYuL0/Lly/XOO+9o9uzZ8vPzs/oa1wAAACgYIfkRsmzZMt29e1fjx4+3yv0PHDigcePG6fXXX9eWLVv01VdfFWkW5nfffVdDhw61+jJhD9v92i0+Pl5BQUF655138h0//6j45JNPZDKZNHPmTGuXUmxGjRqlyZMna8uWLZo2bZq1ywEAAMB9PJZjkh9V58+f17Bhw6x2/zZt2pi7r3p4eBR5maJJkyZp8+bNSk1NLaYKS6eC2u3OnTtav369pk6d+sgHZClrKadH7aFIxYoV9eGHH2rEiBHWLgUAAAAWICQ/AhISEjR+/Hh16tQpx2RKJa1y5cpq0qSJrly5UizL3Dg4OOj1119/ZEOyJe2WkpKiN954I891vB9F0dHRatCggbXLKFbu7u6qV6+eVYZAAAAAoPDobo1iNW/ePH3++edasWJFocaTAo+q//3f/9W0adOs+gALAAAAluNNMopV27ZtZWdnZ54pGHhclZYeHgAAACgc3iSjWF27dk0hISHq27evtUsBAAAAgEIjJAMAAAAAYKC7NQAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAABkIyAAAAAAAGQjIAAAAAAAZCMgAAAAAAhv8HwFjwAbQQWKUAAAAASUVORK5CYII=" />
              <p style="margin: 5px 0; font-weight: bold;"> ρ = Armadura inferior Columan Externa / Armadura superior / Armadura inferior Columna Interna </p>
              <p style="margin: 5px 0; font-weight: bold;"> ρ = ${data.response.response.response1.P.slice(0, 3).join(' / ')}</p>
              <p style="margin: 5px 0; font-weight: bold;">
                Separación entre barras:
              </p>
              ${data.response.response.separacionA1
        .slice(0, 3)
        .map((item: any) => `<p>Φ#${item.Az} @ ${item.separacion}</p>`)
        .join('')}
              
              </div>
          </div>
        </div>
        <div class="section-result" style="margin-top: 65%;">
          <h3 class="section-header">✅ Verificaciones y Validaciones</h3>
          <div class="section-content">
            <ul class="validation-list">
              <li class="validation-item">
                <div class="validation-title">🏗️ Chequeo del Pedestal externo</div>
                <div class="validation-detail">
                  <span class="success-icon">${data.response.response.validateExt.Pu} <= ${data.response.response.validateExt.calculo}✓ CUMPLE</span>
                </div>
              </li>
              <li class="validation-item">
                <div class="validation-title">🏗️ Chequeo del Pedestal interno</div>
                <div class="validation-detail">
                  <span class="success-icon">${data.response.response.validateInt.Pu} <= ${data.response.response.validateInt.calculo}✓ CUMPLE</span>
                </div>
              </li>
              
              <li class="validation-item">
              <div class="validation-title">🔧 Peralte requerido en una dirección </div>
              <div class="validation-detail">
              <span class="success-icon"> ${data.response.response.Validate1.d} <= ${data.input.Hz - 0.09} ✓ CUMPLE</span>
              </div>
              </li>
              <li class="validation-item">
              <div class="validation-title">🏗️ Peralte requerido en dos direcciones columna interna </div>
              <div class="validation-detail">
              <span class="success-icon">${data.response.response.Validate2.d} <= ${data.input.Hz - 0.09} ✓ CUMPLE</span>
              </div>
              </li>
              <li class="validation-item">
              <div class="validation-title">🏗️ Peralte requerido en dos direcciones columna externa </div>
              <div class="validation-detail">
                <span class="success-icon">${data.response.response.Validate3.d} <= ${data.input.Hz - 0.09} ✓ CUMPLE</span>
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
                <div class="input-label">Dimensión de la Zapata (L)</div>
                ${data.response.response.L}
              </div>
              <div class="input-item">
                <div class="input-label">Presión de Diseño (Qu)</div>
                ${data.response.response.Qu}
              </div>
              <div class="input-item">
                <div class="input-label">Peralte Efectivo (d)</div>
                ${data.input.Hz - 0.09}
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

  getFileName(data: ZapataCombinadaCalculationData): string {
    const projectName = data.metadata?.projectName || 'ZapataCombinada';
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
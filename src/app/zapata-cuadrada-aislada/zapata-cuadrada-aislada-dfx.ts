import { Injectable } from '@angular/core';
import { Point, DxfWriter } from '@tarikjabiri/dxf';

@Injectable({ providedIn: 'root' })
export class DxfExportService {

  exportarDxfAvanzado() {
    const dxf = new DxfWriter();

    dxf.addLine(new Point(0, 0, 0), new Point(100, 0, 0));
    dxf.addCircle(new Point(50, 50, 0), 25);
    dxf.addText(new Point(20, 20, 0), 5, 'Texto DXF');

    const contenido = dxf.stringify();

    const blob = new Blob([contenido], { type: 'application/dxf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exportacion.dxf';
    link.click();
  }
}
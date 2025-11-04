import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paciente'
})
export class PacientePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

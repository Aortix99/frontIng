import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'raza'
})
export class RazaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

/**
 * MathExpressionDirective - Directiva para permitir operaciones matemáticas en inputs numéricos
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja la evaluación de expresiones en inputs
 * - Open/Closed: Extensible mediante configuración
 * - Dependency Inversion: Depende del servicio mediante inyección
 */

import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MathExpressionService } from '../../services/math-expression.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMathExpression]',
  standalone: false
})
export class MathExpressionDirective implements OnInit, OnDestroy {
  private subscription?: Subscription;
  private lastValidValue: string = '';

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Optional() private control: NgControl,
    private mathService: MathExpressionService
  ) {}

  ngOnInit(): void {
    // Guardar el valor inicial si existe
    if (this.control?.value) {
      this.lastValidValue = String(this.control.value);
    } else if (this.el.nativeElement.value) {
      this.lastValidValue = this.el.nativeElement.value;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Maneja el evento blur (cuando el input pierde el foco)
   * Evalúa la expresión matemática y actualiza el valor
   */
  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Si está vacío, no hacer nada
    if (!value) {
      return;
    }

    // Si parece ser una expresión matemática, evaluarla
    if (this.mathService.isMathExpression(value)) {
      const result = this.mathService.evaluateExpression(value);
      
      if (result !== null) {
        // Actualizar el input con el resultado
        input.value = this.formatNumber(result);
        
        // Actualizar el FormControl si está disponible
        if (this.control?.control) {
          this.control.control.setValue(result, { emitEvent: true });
        }
        
        this.lastValidValue = input.value;
      } else {
        // Si la expresión es inválida, restaurar el último valor válido
        if (this.lastValidValue) {
          input.value = this.lastValidValue;
          if (this.control?.control) {
            this.control.control.setValue(parseFloat(this.lastValidValue) || null, { emitEvent: true });
          }
        }
      }
    } else {
      // Si no es una expresión, solo validar que sea un número válido
      const numValue = parseFloat(value.replace(/,/g, '.'));
      if (!isNaN(numValue) && isFinite(numValue)) {
        this.lastValidValue = this.formatNumber(numValue);
        input.value = this.lastValidValue;
        if (this.control?.control) {
          this.control.control.setValue(numValue, { emitEvent: true });
        }
      }
    }
  }

  /**
   * Maneja el evento input para guardar valores válidos
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    // Guardar valores que parecen válidos (números simples)
    if (value && !this.mathService.isMathExpression(value)) {
      const numValue = parseFloat(value.replace(/,/g, '.'));
      if (!isNaN(numValue) && isFinite(numValue)) {
        this.lastValidValue = value;
      }
    }
  }

  /**
   * Formatea un número para mostrarlo en el input
   * Elimina ceros innecesarios después del punto decimal
   */
  private formatNumber(value: number): string {
    // Si es un número entero, mostrarlo sin decimales
    if (Number.isInteger(value)) {
      return value.toString();
    }
    
    // Para decimales, limitar a 10 decimales y eliminar ceros finales
    return value.toFixed(10).replace(/\.?0+$/, '');
  }
}

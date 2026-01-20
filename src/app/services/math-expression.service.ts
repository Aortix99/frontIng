/**
 * MathExpressionService - Servicio para evaluar expresiones matemáticas de forma segura
 * Aplica principios SOLID:
 * - Single Responsibility: Solo evalúa expresiones matemáticas
 * - Open/Closed: Extensible mediante configuración
 * - Dependency Inversion: Puede ser inyectado en cualquier componente o directiva
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathExpressionService {

  /**
   * Evalúa una expresión matemática de forma segura
   * Permite operaciones básicas: suma (+), resta (-), multiplicación (*), división (/)
   * También permite paréntesis para agrupar operaciones
   * 
   * @param expression - Expresión matemática como string
   * @returns Resultado numérico o null si la expresión es inválida
   */
  evaluateExpression(expression: string): number | null {
    if (!expression || expression.trim() === '') {
      return null;
    }

    try {
      // Limpiar la expresión: eliminar espacios y validar caracteres permitidos
      const cleanedExpression = expression.trim().replace(/\s+/g, '');
      
      // Validar que solo contenga números, operadores y paréntesis
      if (!this.isValidExpression(cleanedExpression)) {
        return null;
      }

      // Reemplazar comas por puntos para decimales
      const normalizedExpression = cleanedExpression.replace(/,/g, '.');

      // Evaluar la expresión de forma segura
      const result = this.safeEvaluate(normalizedExpression);
      
      // Validar que el resultado sea un número válido
      if (result === null || isNaN(result) || !isFinite(result)) {
        return null;
      }

      return result;
    } catch (error) {
      console.warn('Error evaluando expresión matemática:', error);
      return null;
    }
  }

  /**
   * Valida que la expresión solo contenga caracteres permitidos
   */
  private isValidExpression(expression: string): boolean {
    // Permitir: números, puntos, comas, operadores (+ - * /), paréntesis y espacios
    const validPattern = /^[0-9+\-*/().,\s]+$/;
    
    if (!validPattern.test(expression)) {
      return false;
    }

    // Validar que los paréntesis estén balanceados
    let openParens = 0;
    for (const char of expression) {
      if (char === '(') openParens++;
      if (char === ')') openParens--;
      if (openParens < 0) return false; // Paréntesis cerrado sin abrir
    }
    
    return openParens === 0;
  }

  /**
   * Evalúa la expresión de forma segura sin usar eval()
   * Implementa un parser básico para operaciones matemáticas
   */
  private safeEvaluate(expression: string): number | null {
    try {
      // Manejar paréntesis recursivamente
      let expr = expression;
      while (expr.includes('(')) {
        const lastOpen = expr.lastIndexOf('(');
        const nextClose = expr.indexOf(')', lastOpen);
        
        if (nextClose === -1) {
          return null; // Paréntesis no cerrado
        }
        
        const innerExpr = expr.substring(lastOpen + 1, nextClose);
        const innerResult = this.evaluateSimpleExpression(innerExpr);
        
        if (innerResult === null) {
          return null;
        }
        
        expr = expr.substring(0, lastOpen) + innerResult.toString() + expr.substring(nextClose + 1);
      }
      
      return this.evaluateSimpleExpression(expr);
    } catch (error) {
      return null;
    }
  }

  /**
   * Evalúa una expresión simple sin paréntesis
   * Resuelve multiplicaciones y divisiones primero, luego sumas y restas
   */
  private evaluateSimpleExpression(expression: string): number | null {
    try {
      // Si es solo un número, retornarlo directamente
      const numMatch = expression.match(/^-?\d+\.?\d*$/);
      if (numMatch) {
        return parseFloat(expression);
      }

      // Dividir en tokens (números y operadores)
      const tokens = this.tokenize(expression);
      if (tokens.length === 0) {
        return null;
      }

      // Primera pasada: multiplicación y división
      const processedTokens: (string | number)[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (token === '*' || token === '/') {
          const prev = processedTokens.pop();
          const next = tokens[++i];
          
          if (typeof prev !== 'number' || typeof next !== 'number') {
            return null;
          }
          
          const result = token === '*' ? prev * next : prev / next;
          processedTokens.push(result);
        } else if (typeof token === 'number') {
          processedTokens.push(token);
        } else if (token === '+' || token === '-') {
          processedTokens.push(token);
        }
      }

      // Segunda pasada: suma y resta
      let result = typeof processedTokens[0] === 'number' ? processedTokens[0] : 0;
      
      for (let i = 1; i < processedTokens.length; i += 2) {
        const operator = processedTokens[i];
        const operand = processedTokens[i + 1];
        
        if (typeof operand !== 'number') {
          return null;
        }
        
        if (operator === '+') {
          result += operand;
        } else if (operator === '-') {
          result -= operand;
        } else {
          return null;
        }
      }

      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * Divide la expresión en tokens (números y operadores)
   */
  private tokenize(expression: string): (string | number)[] {
    const tokens: (string | number)[] = [];
    let currentNumber = '';
    let i = 0;

    while (i < expression.length) {
      const char = expression[i];
      
      if ((char >= '0' && char <= '9') || char === '.') {
        currentNumber += char;
        i++;
      } else if (char === '+' || char === '*' || char === '/') {
        // Guardar número anterior si existe
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = '';
        }
        tokens.push(char);
        i++;
      } else if (char === '-') {
        // Guardar número anterior si existe
        if (currentNumber) {
          tokens.push(parseFloat(currentNumber));
          currentNumber = '';
        }
        
        // Determinar si es operador de resta o signo negativo
        // Es signo negativo si: está al inicio, o después de un operador
        const isUnaryMinus = tokens.length === 0 || 
                            (typeof tokens[tokens.length - 1] === 'string' && 
                             (tokens[tokens.length - 1] === '+' || 
                              tokens[tokens.length - 1] === '-' || 
                              tokens[tokens.length - 1] === '*' || 
                              tokens[tokens.length - 1] === '/'));
        
        if (isUnaryMinus) {
          // Es signo negativo, empezar nuevo número negativo
          currentNumber = '-';
        } else {
          // Es operador de resta
          tokens.push('-');
        }
        i++;
      } else {
        // Carácter desconocido, ignorar
        i++;
      }
    }

    // Agregar el último número si existe
    if (currentNumber) {
      tokens.push(parseFloat(currentNumber));
    }

    return tokens;
  }

  /**
   * Verifica si un string parece ser una expresión matemática
   * Solo retorna true si contiene operadores matemáticos (+, -, *, /)
   * Un número simple sin operadores NO se considera expresión matemática
   */
  isMathExpression(value: string): boolean {
    if (!value || value.trim() === '') {
      return false;
    }
    
    // Solo verificar si contiene operadores matemáticos
    // Un número simple (incluso con decimales) NO es una expresión
    const hasOperator = /[+\-*/]/.test(value);
    
    return hasOperator;
  }
}

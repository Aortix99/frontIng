/**
 * AuthInterceptor - Interceptor HTTP para manejo automático de JWT
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja autenticación HTTP
 * - Open/Closed: Extensible para nuevos headers y lógica
 * - Dependency Inversion: Depende de AuthService abstraction
 */

import { Injectable, Inject } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly TOKEN_KEY = 'ing_civil_token';

  constructor(
    private readonly router: Router
  ) {}

  /**
   * Intercepta todas las peticiones HTTP salientes
   * @param request - Request HTTP original
   * @param next - Handler para continuar la cadena
   * @returns Observable con la respuesta HTTP
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clonar el request y agregar token si está disponible
    const authRequest = this.addAuthHeader(request);

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(authRequest, next);
        }
        
        return this.handleOtherErrors(error);
      })
    );
  }

  /**
   * Agrega el header de autorización al request
   * @private
   * @param request - Request HTTP original
   * @returns Request con header de autorización
   */
  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    // URLs que no necesitan autenticación
    const publicUrls = [
      '/api/login',
      '/api/register',
      '/api/health',
      '/api/forgot-password',
      '/api/reset-password'
    ];

    // Si es una URL pública, no agregar token
    if (publicUrls.some(url => request.url.includes(url))) {
      return request;
    }

    // Obtener token directamente del localStorage para evitar dependencia circular
    const token = this.getTokenFromStorage();

    if (token) {
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return request;
  }

  /**
   * Obtiene el token directamente del localStorage
   * @private
   * @returns Token o null
   */
  private getTokenFromStorage(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token del localStorage:', error);
      return null;
    }
  }

  /**
   * Maneja errores 401 (No autorizado)
   * @private
   * @param request - Request que falló
   * @param next - Handler para reintentar
   * @returns Observable con la respuesta HTTP
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Limpiar token del localStorage
      this.clearTokenFromStorage();
      
      // Redirigir al login
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });

      return throwError(() => new Error('Sesión expirada'));
    }

    // Si ya se está renovando el token, esperar
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(this.addAuthHeader(request)))
    );
  }

  /**
   * Limpia el token del localStorage
   * @private
   */
  private clearTokenFromStorage(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('ing_civil_refresh_token');
    } catch (error) {
      console.error('Error limpiando tokens del localStorage:', error);
    }
  }

  /**
   * Maneja otros tipos de errores HTTP
   * @private
   * @param error - Error HTTP recibido
   * @returns Observable con el error procesado
   */
  private handleOtherErrors(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Solicitud inválida';
          break;
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflicto en los datos';
          break;
        case 422:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intenta más tarde.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Servicio temporalmente no disponible';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    // Log del error para debugging
    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      timestamp: new Date().toISOString()
    });

    return throwError(() => ({
      ...error,
      userMessage: errorMessage
    }));
  }
}

/**
 * LoadingInterceptor - Interceptor para mostrar indicadores de carga
 * Opcional: Para mostrar spinners globales durante las peticiones
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this.loadingSubject.asObservable();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // URLs que no deben mostrar loading global
    const noLoadingUrls = [
      '/api/health',
      '/api/verify-token'
    ];

    const shouldShowLoading = !noLoadingUrls.some(url => request.url.includes(url));

    if (shouldShowLoading) {
      this.loadingRequests++;
      this.updateLoadingState();
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (shouldShowLoading) {
          this.loadingRequests--;
          this.updateLoadingState();
        }
        return throwError(() => error);
      }),
      // Finalizar loading al completar
      switchMap((event) => {
        if (shouldShowLoading && event.type === 4) { // HttpEventType.Response
          this.loadingRequests--;
          this.updateLoadingState();
        }
        return [event];
      })
    );
  }

  private updateLoadingState(): void {
    this.loadingSubject.next(this.loadingRequests > 0);
  }
}

/**
 * RetryInterceptor - Interceptor para reintentar peticiones fallidas
 * Implementa lógica de retry con backoff exponencial
 */
@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo reintentar para ciertos tipos de errores y métodos
    if (this.shouldRetry(request)) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (this.isRetryableError(error)) {
            // Reintentar hasta 3 veces con delay exponencial
            return this.retryWithBackoff(request, next, 3);
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }

  private shouldRetry(request: HttpRequest<any>): boolean {
    // Solo reintentar GET requests y algunos POST específicos
    return request.method === 'GET' || 
           request.url.includes('/api/health');
  }

  private isRetryableError(error: HttpErrorResponse): boolean {
    // Reintentar solo para errores de red o servidor
    return error.status === 0 || 
           error.status >= 500 || 
           error.status === 408; // Request Timeout
  }

  private retryWithBackoff(
    request: HttpRequest<any>, 
    next: HttpHandler, 
    maxRetries: number
  ): Observable<HttpEvent<any>> {
    let retries = 0;
    
    const retryRequest = (): Observable<HttpEvent<any>> => {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (retries < maxRetries && this.isRetryableError(error)) {
            retries++;
            const delay = Math.pow(2, retries) * 1000; // Backoff exponencial
            
            return new Observable<HttpEvent<any>>(subscriber => {
              setTimeout(() => {
                retryRequest().subscribe({
                  next: (event) => subscriber.next(event),
                  error: (err) => subscriber.error(err),
                  complete: () => subscriber.complete()
                });
              }, delay);
            });
          }
          return throwError(() => error);
        })
      );
    };

    return retryRequest();
  }
}
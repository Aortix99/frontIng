/**
 * AuthGuard - Guard para proteger rutas que requieren autenticación
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja autorización de rutas
 * - Open/Closed: Extensible para lógica adicional de autorización
 * - Dependency Inversion: Depende de AuthService abstraction
 */

import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  CanLoad, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Route, 
  UrlSegment 
} from '@angular/router';
import { Observable, map, take, filter } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Verifica si una ruta puede ser activada
   * @param route - Información de la ruta
   * @param state - Estado del router
   * @returns Observable<boolean> - True si puede acceder, false si no
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthentication(state.url);
  }

  /**
   * Verifica si las rutas hijas pueden ser activadas
   * @param childRoute - Ruta hija
   * @param state - Estado del router
   * @returns Observable<boolean> - True si puede acceder, false si no
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

  /**
   * Verifica si un módulo puede ser cargado lazy
   * @param route - Información de la ruta
   * @param segments - Segmentos de URL
   * @returns Observable<boolean> - True si puede cargar, false si no
   */
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> {
    const url = segments.map(segment => segment.path).join('/');
    return this.checkAuthentication(`/${url}`);
  }

  /**
   * Verifica el estado de autenticación
   * @private
   * @param redirectUrl - URL a la que redirigir después del login
   * @returns Observable<boolean> - True si está autenticado, false si no
   */
  private checkAuthentication(redirectUrl: string): Observable<boolean> {
    console.log('🛡️ AuthGuard verificando autenticación para:', redirectUrl);
    
    // Verificación más simple y directa
    return this.authService.authState$.pipe(
      // Esperar hasta que NO esté en loading (inicialización terminada)
      filter(authState => !authState.isLoading),
      take(1),
      map(authState => {
        console.log('🛡️ Estado de auth:', {
          isAuthenticated: authState.isAuthenticated,
          user: authState.user?.email || 'No user',
          hasToken: !!authState.token,
          isLoading: authState.isLoading
        });
        
        if (authState.isAuthenticated && authState.user) {
          console.log('✅ Usuario autenticado, permitiendo acceso');
          return true;
        }

        // Si no está autenticado, redirigir al login
        console.log('❌ Usuario no autenticado, redirigiendo a login');
        this.redirectToLogin(redirectUrl);
        return false;
      })
    );
  }

  /**
   * Redirige al usuario al login
   * @private
   * @param returnUrl - URL de retorno después del login
   */
  private redirectToLogin(returnUrl: string): void {
    // Guardar la URL de retorno para después del login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true
    });
  }
}

/**
 * GuestGuard - Guard para rutas que solo deben ser accesibles por usuarios no autenticados
 * Útil para páginas de login/register que no deben ser accesibles si ya estás loggeado
 */
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Verifica si una ruta puede ser activada por un usuario no autenticado
   * @param route - Información de la ruta
   * @param state - Estado del router
   * @returns Observable<boolean> - True si NO está autenticado, false si está autenticado
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          return true;
        }

        // Si ya está autenticado, redirigir al dashboard
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        return false;
      })
    );
  }
}

/**
 * AdminGuard - Guard para rutas que requieren permisos de administrador
 * Ejemplo de extensibilidad del sistema de guards
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        // Verificar si el usuario es admin (esto dependería de tu modelo de usuario)
        const isAdmin = user && (user as any).role === 'admin';
        
        if (isAdmin) {
          return true;
        }

        // Si no es admin, redirigir a página de acceso denegado
        this.router.navigate(['/access-denied'], { replaceUrl: true });
        return false;
      })
    );
  }
}
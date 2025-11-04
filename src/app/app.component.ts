/**
 * AppComponent - Componente raíz de la aplicación
 * Responsabilidades:
 * - Gestión del estado de autenticación global
 * - Navegación principal
 * - Loading states globales
 * 
 * Principios aplicados:
 * - SRP: Responsabilidad única de coordinación global
 * - Reactive Programming: Uso de Observables para estado
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Sistema de Ingeniería Civil';
  isLoading = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeApp();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa la aplicación verificando autenticación
   */
  private initializeApp(): void {
    this.isLoading = true;
    
    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isAuthenticated: boolean) => {
          this.isLoading = false;
          if (!isAuthenticated && this.requiresAuth()) {
            this.router.navigate(['/auth/login']);
          }
        },
        error: (error: any) => {
          console.error('Error verificando autenticación:', error);
          this.isLoading = false;
          this.router.navigate(['/auth/login']);
        }
      });
  }

  /**
   * Configura eventos del router para loading states
   */
  private setupRouterEvents(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        // Aquí puedes agregar lógica adicional para cada navegación
        if (event instanceof NavigationEnd) {
          this.updatePageTitle(event.url);
        }
      });
  }

  /**
   * Actualiza el título de la página según la ruta
   */
  private updatePageTitle(url: string): void {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard - Ing Civil',
      '/auth/login': 'Iniciar Sesión - Ing Civil',
      '/auth/register': 'Registro - Ing Civil',
      '/dueno': 'Gestión de Dueños - Ing Civil',
      '/paciente': 'Gestión de Pacientes - Ing Civil',
      '/raza': 'Gestión de Razas - Ing Civil',
      '/especie': 'Gestión de Especies - Ing Civil',
      '/zapata-cuadrada-aislada': 'Zapata Cuadrada Aislada - Ing Civil',
      '/inicio': 'Zapatas Combinadas - Ing Civil'
    };

    const title = titles[url] || 'Sistema de Ingeniería Civil';
    document.title = title;
  }

  /**
   * Verifica si la ruta actual requiere autenticación
   */
  private requiresAuth(): boolean {
    const currentUrl = this.router.url;
    const publicRoutes = ['/auth/login', '/auth/register'];
    return !publicRoutes.includes(currentUrl);
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.isLoading = true;
    
    // El logout del AuthService es void, no retorna Observable
    this.authService.logout();
    this.isLoading = false;
    this.router.navigate(['/auth/login']);
  }

  /**
   * Maneja errores globales de la aplicación
   */
  handleGlobalError(error: any): void {
    console.error('Error global de aplicación:', error);
    
    // Aquí puedes agregar lógica para mostrar notificaciones
    // o manejar errores específicos
    
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}

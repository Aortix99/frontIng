/**
 * DashboardComponent - Dashboard principal con sidebar y navegación
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja la vista del dashboard y navegación
 * - Dependency Inversion: Depende de AuthService
 * - Open/Closed: Fácil agregar nuevas secciones sin modificar lógica existente
 */

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

// Tipo para las secciones disponibles
type DashboardSection = 'dashboard' | 'zapata-cuadrada-aislada' | 'zapata-combinada';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  // Estado del componente
  public currentUser: User | null = null;
  public isLoading = false;
  public sidebarCollapsed = false;
  public activeSection: DashboardSection = 'dashboard';
  public isMobile = false;

  // Mapeo de títulos de página
  private readonly pageTitles: Record<DashboardSection, string> = {
    'dashboard': 'Inicio',
    'zapata-cuadrada-aislada': 'Zapata Cuadrada Aislada',
    'zapata-combinada': 'Zapata Combinada'
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    console.log('🎯 DashboardComponent.ngOnInit - Iniciando dashboard');
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Escucha cambios en el tamaño de la ventana
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  /**
   * Verifica el tamaño de pantalla para responsive
   * @private
   */
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  /**
   * Configura las suscripciones a observables
   * @private
   */
  private setupSubscriptions(): void {
    console.log('🔄 DashboardComponent.setupSubscriptions - Configurando suscripciones');
    
    // Suscribirse al usuario actual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('👤 DashboardComponent - Usuario actual:', user);
        this.currentUser = user;
      });

    // Suscribirse al estado de autenticación
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authState => {
        console.log('🔒 DashboardComponent - Estado de auth:', authState);
        this.isLoading = authState.isLoading;
        
        // Si no está autenticado, redirigir al login
        if (!authState.isAuthenticated && !authState.isLoading) {
          console.log('❌ DashboardComponent - No autenticado, redirigiendo al login');
          this.router.navigate(['/auth/login']);
        }
      });
  }

  /**
   * Alterna el estado colapsado del sidebar
   */
  public toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  /**
   * Establece la sección activa
   * @param section - Sección a activar
   */
  public setActiveSection(section: DashboardSection): void {
    this.activeSection = section;
    
    // En móvil, colapsar sidebar después de seleccionar
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  /**
   * Obtiene el título de la página actual
   * @returns Título de la página
   */
  public getPageTitle(): string {
    return this.pageTitles[this.activeSection] || 'Dashboard';
  }

  /**
   * Obtiene la inicial del usuario para el avatar
   * @returns Inicial del nombre del usuario
   */
  public getUserInitial(): string {
    if (!this.currentUser?.name) {
      return 'U';
    }
    return this.currentUser.name.charAt(0).toUpperCase();
  }

  /**
   * Maneja el logout del usuario
   */
  public onLogout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }

  /**
   * Método de debugging para limpiar tokens inválidos
   * TODO: Remover en producción
   */
  public clearTokens(): void {
    console.log('🧹 Limpiando tokens de debugging...');
    this.authService.clearInvalidTokens();
    window.location.reload();
  }

  /**
   * Navega a una sección específica del sistema usando rutas relativas
   * @param section - Sección a la que navegar
   */
  public navigateToSection(section: string): void {
    console.log('🔄 Navegando a sección:', section);
    
    // Para "inicio", navegamos a la ruta base del dashboard (carga WelcomeComponent)
    if (section === 'inicio') {
      this.router.navigate([''], { relativeTo: this.route }).catch(error => {
        console.error('❌ Error navegando a inicio:', error);
      });
      return;
    }
    
    // Para otras secciones, navegar usando rutas relativas
    this.router.navigate([section], { relativeTo: this.route }).catch(error => {
      console.error('❌ Error navegando a:', section, error);
      // Fallback: navegar a inicio
      this.router.navigate([''], { relativeTo: this.route });
    });
  }

  /**
   * Verifica si una sección está activa
   * @param section - Sección a verificar
   * @returns True si la sección está activa
   */
  public isActiveSection(section: DashboardSection): boolean {
    return this.activeSection === section;
  }

  /**
   * Maneja clics en el overlay móvil
   */
  public onOverlayClick(): void {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }
}
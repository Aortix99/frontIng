/**
 * AuthService - Servicio de autenticación
 * Aplica principios SOLID:
 * - Single Responsibility: Solo maneja autenticación y autorización
 * - Open/Closed: Extensible para nuevos métodos de auth sin modificar existentes
 * - Dependency Inversion: Depende de abstracciones (HttpClient, interfaces)
 * - Interface Segregation: Métodos específicos y cohesivos
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  AuthState, 
  AuthConfig,
  LoadingState,
  ApiResponse 
} from '../models/auth.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CONFIG: AuthConfig = {
    apiBaseUrl: environment.apiUrl,
    tokenKey: 'ing_civil_token',
    refreshTokenKey: 'ing_civil_refresh_token',
    tokenExpirationBuffer: 5 // 5 minutos antes de expirar
  };

  // Estado reactivo de autenticación
  private readonly authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true, // Iniciar como loading para evitar redirecciones tempranas
    error: null
  });

  // Estado de carga para operaciones
  private readonly loadingStateSubject = new BehaviorSubject<LoadingState>('idle');

  // Flag para rastrear si la inicialización ha terminado
  private readonly initializationCompleteSubject = new BehaviorSubject<boolean>(false);
  public readonly initializationComplete$ = this.initializationCompleteSubject.asObservable();

  // Observables públicos (solo lectura)
  public readonly authState$ = this.authStateSubject.asObservable();
  public readonly loadingState$ = this.loadingStateSubject.asObservable();
  public readonly isAuthenticated$ = this.authState$.pipe(
    map(state => state.isAuthenticated)
  );
  public readonly currentUser$ = this.authState$.pipe(
    map(state => state.user)
  );

  constructor(private readonly http: HttpClient) {
    this.initializeAuthState();
    this.startTokenExpirationCheck();
  }

  /**
   * Inicializa el estado de autenticación desde localStorage
   * @private
   */
  private initializeAuthState(): void {
    console.log('🔄 Inicializando estado de autenticación...');
    try {
      const token = this.getStoredToken();
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (token) {
        // Verificar validez básica del token (formato y expiración)
        if (this.isTokenValid(token)) {
          console.log('✅ Token válido localmente');
          
          // CAMBIO CLAVE: Asumir autenticado inmediatamente si el token es válido localmente
          // Esto evita redirecciones durante la verificación del backend
          const payload = this.decodeJWT(token);
          const tempUser: User = {
            id: payload.id,
            email: payload.email,
            name: payload.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Establecer como autenticado inmediatamente
          this.updateAuthState(true, tempUser, token, false);
          this.initializationCompleteSubject.next(true);
          
          // Verificar con backend en segundo plano
          console.log('🔍 Verificando token con backend en segundo plano...');
          this.verifyTokenWithBackend(token).subscribe({
            next: (user) => {
              console.log('✅ Token verificado con backend, actualizando usuario:', user);
              this.updateAuthState(true, user, token, false);
            },
            error: (error) => {
              console.warn('⚠️ Token rechazado por backend, limpiando estado:', error.message || error);
              this.clearAuthState();
            }
          });
        } else {
          console.log('❌ Token expirado o formato inválido, limpiando...');
          this.clearAuthState();
          this.initializationCompleteSubject.next(true);
        }
      } else {
        console.log('ℹ️ No hay token almacenado');
        this.clearAuthState();
        this.initializationCompleteSubject.next(true);
      }
    } catch (error) {
      console.error('❌ Error inicializando estado de auth:', error);
      this.clearAuthState();
      this.initializationCompleteSubject.next(true);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param loginData - Datos de login
   * @returns Observable con el resultado del login
   */
  public login(loginData: LoginRequest): Observable<User> {
    this.setLoadingState('loading');
    this.updateAuthState(false, null, null, true);

    return this.http.post<AuthResponse>(`${this.CONFIG.apiBaseUrl}/login`, loginData)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        map(response => response.data.user),
        catchError(error => this.handleAuthError(error)),
        tap(() => this.setLoadingState('success'))
      );
  }

  /**
   * Registra un nuevo usuario
   * @param registerData - Datos de registro
   * @returns Observable con el resultado del registro
   */
  public register(registerData: RegisterRequest): Observable<User> {
    console.log('🌐 AuthService.register called with:', registerData);
    console.log('🔗 API URL:', `${this.CONFIG.apiBaseUrl}/register`);
    
    this.setLoadingState('loading');
    this.updateAuthState(false, null, null, true);

    return this.http.post<AuthResponse>(`${this.CONFIG.apiBaseUrl}/register`, registerData)
      .pipe(
        tap(response => {
          console.log('✅ Register HTTP response:', response);
          this.handleAuthSuccess(response);
        }),
        map(response => response.data.user),
        catchError(error => {
          console.error('❌ Register HTTP error:', error);
          return this.handleAuthError(error);
        }),
        tap(() => this.setLoadingState('success'))
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    console.log('👋 Usuario haciendo logout...');
    this.clearAuthState();
    this.setLoadingState('idle');
    
    // Opcional: notificar al backend sobre el logout
    // this.notifyBackendLogout().subscribe();
  }

  /**
   * Fuerza la limpieza de tokens inválidos
   * Útil para debugging o cuando se detectan problemas de autenticación
   */
  public clearInvalidTokens(): void {
    console.log('🧹 Forzando limpieza de tokens...');
    this.clearAuthState();
  }

  /**
   * Verifica si el token actual es válido
   * @returns boolean indicando si el token es válido
   */
  public isTokenValid(token?: string): boolean {
    const tokenToCheck = token || this.getStoredToken();
    
    if (!tokenToCheck) {
      return false;
    }

    try {
      const payload = this.decodeJWT(tokenToCheck);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el token actual
   * @returns Token actual o null
   */
  public getCurrentToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Obtiene el usuario actual
   * @returns Usuario actual o null
   */
  public getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Verifica el token con el backend
   * @private
   */
  private verifyTokenWithBackend(token: string): Observable<User> {
    return this.http.get<ApiResponse<{ user: User }>>(`${this.CONFIG.apiBaseUrl}/verify-token`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      map(response => {
        if (response.success && response.data?.user) {
          return response.data.user;
        }
        throw new Error('Respuesta inválida del servidor');
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('🔍 Error del backend al verificar token:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        
        // No limpiar estado aquí, se maneja en initializeAuthState
        if (error.status === 401 || error.status === 403) {
          return throwError(() => new Error('Token expirado o inválido'));
        } else if (error.status === 0) {
          return throwError(() => new Error('No se puede conectar al servidor'));
        }
        
        return throwError(() => new Error('Error de servidor'));
      })
    );
  }

  /**
   * Maneja una respuesta de autenticación exitosa
   * @private
   */
  private handleAuthSuccess(response: AuthResponse): void {
    const { token, user } = response.data;
    
    this.storeToken(token);
    this.updateAuthState(true, user, token, false);
  }

  /**
   * Maneja errores de autenticación
   * @private
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    this.setLoadingState('error');
    this.updateAuthState(false, null, null, false, error.error?.message || 'Error de autenticación');
    
    console.error('Error de autenticación:', error);
    return throwError(() => error);
  }

  /**
   * Actualiza el estado de autenticación
   * @private
   */
  private updateAuthState(
    isAuthenticated: boolean, 
    user: User | null, 
    token: string | null, 
    isLoading: boolean = false,
    error: string | null = null
  ): void {
    this.authStateSubject.next({
      isAuthenticated,
      user,
      token,
      isLoading,
      error
    });
  }

  /**
   * Limpia el estado de autenticación
   * @private
   */
  private clearAuthState(): void {
    console.log('🧹 Limpiando estado de autenticación...');
    this.removeStoredToken();
    this.updateAuthState(false, null, null, false);
  }

  /**
   * Establece el estado de carga
   * @private
   */
  private setLoadingState(state: LoadingState): void {
    this.loadingStateSubject.next(state);
  }

  /**
   * Almacena el token en localStorage
   * @private
   */
  private storeToken(token: string): void {
    try {
      localStorage.setItem(this.CONFIG.tokenKey, token);
    } catch (error) {
      console.error('Error almacenando token:', error);
    }
  }

  /**
   * Obtiene el token almacenado
   * @private
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.CONFIG.tokenKey);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Remueve el token almacenado
   * @private
   */
  private removeStoredToken(): void {
    try {
      localStorage.removeItem(this.CONFIG.tokenKey);
      if (this.CONFIG.refreshTokenKey) {
        localStorage.removeItem(this.CONFIG.refreshTokenKey);
      }
    } catch (error) {
      console.error('Error removiendo token:', error);
    }
  }

  /**
   * Decodifica un token JWT
   * @private
   */
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Token JWT inválido');
    }
  }

  /**
   * Inicia verificación periódica de expiración del token
   * @private
   */
  private startTokenExpirationCheck(): void {
    // Verificar cada 5 minutos
    timer(0, 5 * 60 * 1000).pipe(
      switchMap(() => {
        const token = this.getCurrentToken();
        if (token && !this.isTokenValid(token)) {
          this.logout();
        }
        return [];
      })
    ).subscribe();
  }
}
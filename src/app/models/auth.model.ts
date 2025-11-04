/**
 * Interfaces para manejo de autenticación
 * Aplica principios SOLID:
 * - Interface Segregation: Interfaces específicas para cada operación
 * - Single Responsibility: Cada interface tiene un propósito específico
 */

import { User } from './user.model';

// Re-exportar User para conveniencia
export { User } from './user.model';

/**
 * Interfaz para request de login
 */
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

/**
 * Interfaz para request de registro
 */
export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword?: string;
}

/**
 * Interfaz para la respuesta de autenticación del backend
 */
export interface AuthResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly token: string;
    readonly user: User;
  };
}

/**
 * Interfaz para respuesta de error del backend
 */
export interface ErrorResponse {
  readonly success: false;
  readonly message: string;
  readonly code?: string;
  readonly errors?: Array<{
    readonly field?: string;
    readonly message: string;
    readonly value?: any;
  }>;
  readonly timestamp: string;
}

/**
 * Interfaz para el estado de autenticación en la aplicación
 */
export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly user: User | null;
  readonly token: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Interfaz para opciones de configuración del AuthService
 */
export interface AuthConfig {
  readonly apiBaseUrl: string;
  readonly tokenKey: string;
  readonly refreshTokenKey?: string;
  readonly tokenExpirationBuffer: number; // minutes
}

/**
 * Tipo para los diferentes estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Interfaz para validación de formularios
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: Record<string, string[]>;
}

/**
 * Interfaz para respuesta genérica de la API
 */
export interface ApiResponse<T = any> {
  readonly success: boolean;
  readonly message: string;
  readonly data?: T;
  readonly errors?: any[];
  readonly timestamp: string;
}
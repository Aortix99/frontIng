/**
 * Interfaz para el modelo de Usuario
 * Aplica principios SOLID:
 * - Interface Segregation: Define solo propiedades necesarias del usuario
 * - Single Responsibility: Solo define la estructura del usuario
 */
export interface User {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

/**
 * Interfaz para datos de usuario en formularios (mutable)
 */
export interface UserData {
  email: string;
  name: string;
}

/**
 * Interfaz para el perfil extendido del usuario
 */
export interface UserProfile extends User {
  readonly lastLogin?: string;
  readonly isActive?: boolean;
  readonly role?: string;
}
/**
 * LoginComponent - Componente para inicio de sesión
 * Aplica principios SOLID y Clean Code:
 * - Single Responsibility: Solo maneja el formulario de login
 * - Open/Closed: Extensible para nuevos métodos de autenticación
 * - Dependency Inversion: Depende de AuthService abstraction
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoadingState } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  public loginForm!: FormGroup;
  public loadingState: LoadingState = 'idle';
  public errorMessage: string = '';
  public showPassword: boolean = false;
  
  private returnUrl: string = '/dashboard';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupSubscriptions();
    this.getReturnUrl();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   * @private
   */
  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '', 
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(128)
        ]
      ],
      rememberMe: [false]
    });
  }

  /**
   * Configura las suscripciones a observables
   * @private
   */
  private setupSubscriptions(): void {
    // Suscribirse al estado de carga
    this.authService.loadingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.loadingState = state;
      });

    // Suscribirse al estado de autenticación para errores
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(authState => {
        if (authState.error) {
          this.errorMessage = authState.error;
        } else {
          this.errorMessage = '';
        }
      });
  }

  /**
   * Obtiene la URL de retorno de los query params
   * @private
   */
  private getReturnUrl(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  /**
   * Maneja el envío del formulario de login
   */
  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const loginData: LoginRequest = {
      email: this.loginForm.value.email.trim().toLowerCase(),
      password: this.loginForm.value.password
    };

    this.performLogin(loginData);
  }

  /**
   * Ejecuta el proceso de login
   * @private
   * @param loginData - Datos de login validados
   */
  private performLogin(loginData: LoginRequest): void {
    this.errorMessage = '';
    
    this.authService.login(loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          console.log('Login exitoso:', user);
          this.navigateToReturnUrl();
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.handleLoginError(error);
        }
      });
  }

  /**
   * Navega a la URL de retorno después del login exitoso
   * @private
   */
  private navigateToReturnUrl(): void {
    this.router.navigate([this.returnUrl], { replaceUrl: true });
  }

  /**
   * Maneja errores de login
   * @private
   * @param error - Error recibido
   */
  private handleLoginError(error: any): void {
    if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 401) {
      this.errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
    } else if (error.status === 0) {
      this.errorMessage = 'No se puede conectar al servidor. Verifica tu conexión.';
    } else {
      this.errorMessage = 'Error inesperado. Intenta nuevamente.';
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   * @private
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Navega a la página de registro
   */
  public goToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }

  /**
   * Navega a la página de recuperación de contraseña
   */
  public goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  // Getters para facilitar acceso en el template
  public get email() { return this.loginForm.get('email'); }
  public get password() { return this.loginForm.get('password'); }
  public get isLoading() { return this.loadingState === 'loading'; }
  public get hasError() { return this.loadingState === 'error' || !!this.errorMessage; }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param fieldName - Nombre del campo
   * @returns Mensaje de error o cadena vacía
   */
  public getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    
    if (errors['email']) {
      return 'Ingresa un email válido';
    }
    
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['maxlength']) {
      return `${this.getFieldDisplayName(fieldName)} no puede exceder ${errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene el nombre para mostrar de un campo
   * @private
   * @param fieldName - Nombre del campo
   * @returns Nombre para mostrar
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      'email': 'Email',
      'password': 'Contraseña'
    };

    return displayNames[fieldName] || fieldName;
  }
}
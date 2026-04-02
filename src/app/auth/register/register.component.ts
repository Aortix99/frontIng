/**
 * RegisterComponent - Componente para registro de usuarios
 * Aplica principios SOLID y Clean Code:
 * - Single Responsibility: Solo maneja registro de usuarios
 * - Open/Closed: Extensible para nuevos campos o validaciones
 * - Dependency Inversion: Depende de AuthService abstraction
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { RegisterRequest, LoadingState } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  public registerForm!: FormGroup;
  public loadingState: LoadingState = 'idle';
  public errorMessage: string = '';
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupSubscriptions();
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
    this.registerForm = this.formBuilder.group({
      name: [
        '', 
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        ]
      ],
      email: [
        '', 
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^3\d{9}$/),
        ],
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          this.passwordStrengthValidator
        ]
      ],
      confirmPassword: [
        '', 
        [
          Validators.required
        ]
      ],
      acceptTerms: [
        false, 
        [
          Validators.requiredTrue
        ]
      ],
      newsletter: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para fuerza de contraseña
   * @private
   * @param control - Control de formulario
   * @returns Errores de validación o null
   */
  private passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    
    if (!password) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return passwordValid ? null : { passwordStrength: true };
  }

  /**
   * Validador para confirmar que las contraseñas coinciden
   * @private
   * @param group - FormGroup
   * @returns Errores de validación o null
   */
  private passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
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

  /** Solo números, máximo 10 (celular CO) */
  public stripPhoneDigits(): void {
    const c = this.registerForm.get('phone');
    if (!c) {
      return;
    }
    const digits = String(c.value ?? '').replace(/\D/g, '').slice(0, 10);
    if (digits !== c.value) {
      c.setValue(digits, { emitEvent: false });
      c.updateValueAndValidity();
    }
  }

  /**
   * Maneja el envío del formulario de registro
   */
  public onSubmit(): void {
    console.log('🚀 onSubmit called');
    console.log('📋 Form valid:', this.registerForm.valid);
    console.log('📋 Form values:', this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('❌ Form is invalid, marking fields as touched');
      this.markFormGroupTouched();
      return;
    }

    const phoneDigits = String(this.registerForm.value.phone ?? '').replace(/\D/g, '');
    const registerData: RegisterRequest = {
      name: this.registerForm.value.name.trim(),
      email: this.registerForm.value.email.trim().toLowerCase(),
      phone: phoneDigits,
      password: this.registerForm.value.password
    };

    console.log('📤 Sending register data:', registerData);
    this.performRegister(registerData);
  }

  /**
   * Ejecuta el proceso de registro
   * @private
   * @param registerData - Datos de registro validados
   */
  private performRegister(registerData: RegisterRequest): void {
    console.log('🔄 performRegister called with:', registerData);
    this.errorMessage = '';
    
    this.authService.register(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.authService.clearAuthErrorMessage();
          void this.router.navigate(['/auth/login'], {
            replaceUrl: true,
            queryParams: { registered: '1' },
          });
        },
        error: (error) => {
          console.error('❌ Error en registro:', error);
          console.error('📄 Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.handleRegisterError(error);
        }
      });
  }

  /**
   * Maneja errores de registro
   * @private
   * @param error - Error recibido
   */
  private handleRegisterError(error: any): void {
    if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 409) {
      this.errorMessage = 'El correo electrónico ya está registrado.';
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
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
   * Alterna la visibilidad de confirmar contraseña
   */
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Navega a la página de login
   */
  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Abre términos y condiciones (placeholder)
   */
  public openTerms(): void {
    // TODO: Implementar modal o navegación a términos
    console.log('Abrir términos y condiciones');
  }

  /**
   * Abre política de privacidad (placeholder)
   */
  public openPrivacy(): void {
    // TODO: Implementar modal o navegación a política
    console.log('Abrir política de privacidad');
  }

  /**
   * Calcula la fortaleza de la contraseña
   * @returns Porcentaje de fortaleza (0-100)
   */
  public getPasswordStrengthPercentage(): number {
    const password = this.password?.value || '';
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 12.5;

    return Math.min(strength, 100);
  }

  /**
   * Obtiene la clase CSS para la barra de fortaleza
   * @returns Clase CSS
   */
  public getPasswordStrengthClass(): string {
    const percentage = this.getPasswordStrengthPercentage();
    
    if (percentage < 30) return 'weak';
    if (percentage < 70) return 'medium';
    return 'strong';
  }

  /**
   * Obtiene el texto descriptivo de la fortaleza
   * @returns Texto descriptivo
   */
  public getPasswordStrengthText(): string {
    const percentage = this.getPasswordStrengthPercentage();
    
    if (percentage < 30) return 'Débil';
    if (percentage < 70) return 'Media';
    return 'Fuerte';
  }

  // Getters para facilitar acceso en el template
  public get name() { return this.registerForm.get('name'); }
  public get email() { return this.registerForm.get('email'); }
  public get phone() { return this.registerForm.get('phone'); }
  public get password() { return this.registerForm.get('password'); }
  public get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  public get acceptTerms() { return this.registerForm.get('acceptTerms'); }
  public get isLoading() { return this.loadingState === 'loading'; }
  public get hasError() { return this.loadingState === 'error' || !!this.errorMessage; }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param fieldName - Nombre del campo
   * @returns Mensaje de error o cadena vacía
   */
  public getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
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

    if (errors['pattern']) {
      if (fieldName === 'name') {
        return 'El nombre solo puede contener letras y espacios';
      }
      if (fieldName === 'phone') {
        return 'El celular debe tener 10 dígitos y comenzar con 3';
      }
    }

    if (fieldName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    if (errors['passwordStrength']) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales';
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    if (errors['requiredTrue']) {
      return 'Debes aceptar los términos y condiciones';
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
      'name': 'Nombre',
      'email': 'Email',
      'phone': 'Celular',
      'password': 'Contraseña',
      'confirmPassword': 'Confirmar contraseña'
    };

    return displayNames[fieldName] || fieldName;
  }
}
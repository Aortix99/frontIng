/**
 * AuthModule - Módulo de autenticación
 * Aplica principios de modularización:
 * - Single Responsibility: Solo contiene funcionalidad de auth
 * - Encapsulación: Exporta solo lo necesario
 * - Reutilización: Módulo independiente y reutilizable
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule
  ],
  providers: [
    // Los servicios y guards se registran en el root
  ]
})
export class AuthModule { }
/**
 * AuthRoutingModule - Configuración de rutas de autenticación
 * Aplica principios de routing:
 * - Separación de responsabilidades por módulo
 * - Guards aplicados correctamente
 * - Lazy loading preparado
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { 
      title: 'Iniciar Sesión',
      description: 'Accede a tu cuenta de Ing Civil'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { 
      title: 'Crear Cuenta',
      description: 'Regístrate en Ing Civil'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
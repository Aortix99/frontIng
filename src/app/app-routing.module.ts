/**
 * AppRoutingModule - Configuración principal de rutas con autenticación
 * Aplica principios de routing:
 * - Guards para protección de rutas
 * - Lazy loading para módulos
 * - Redirecciones apropiadas
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar guards
import { AuthGuard, GuestGuard } from './guards/auth.guard';

// Importar componentes existentes
import { InicioComponent } from './inicio/inicio.component';
import { ZapataCuadradaAisladaComponent } from './zapata-cuadrada-aislada/zapata-cuadrada-aislada.component';
import { ZapataExcentricaVigaAmarreComponent } from './zapata-excentrica-viga-amarre/zapata-excentrica-viga-amarre.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

// Importar nuevo componente dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { ZapataAisladaComponent } from './zapata-esquinera/zapata-aislada.component';

const routes: Routes = [
  // Redirección por defecto
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Dashboard principal (requiere autenticación)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Dashboard - Ing Civil',
      description: 'Panel principal del sistema'
    },
    children: [
      {
        path: '',
        component: WelcomeComponent
      },
      {
        path: 'zapata-cuadrada-aislada',
        component: ZapataCuadradaAisladaComponent
      },
      {
        path: 'zapata-aislada',
        component: ZapataAisladaComponent
      },
      {
        path: 'zapata-combinada', 
        component: InicioComponent
      },
      {
        path: 'zapata-excentrica-viga-amarre',
        component: ZapataExcentricaVigaAmarreComponent
      }
    ]
  },

  // Módulo de autenticación (lazy loading)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
    data: { 
      title: 'Autenticación'
    }
  },

  // Rutas existentes protegidas con autenticación
  {
    path: 'zapata-combinada',
    component: InicioComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Inicio',
      description: 'Página de inicio del sistema'
    }
  },

  // Cálculos estructurales
  {
    path: 'zapata-cuadrada-aislada',
    component: ZapataCuadradaAisladaComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Zapata Cuadrada Aislada',
      description: 'Cálculo de zapatas cuadradas aisladas'
    }
  },
  {
    path: 'zapata-excentrica-viga-amarre',
    component: ZapataExcentricaVigaAmarreComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Zapata Excéntrica con Viga de Amarre',
      description: 'Cálculo de zapatas excéntricas con viga de amarre'
    }
  },
  {
    path: 'zapata-aislada',
    component: ZapataAisladaComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Zapata Esquinera',
      description: 'Cálculo de zapatas esquinera'
    }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Configuraciones de routing
    enableTracing: false, // Cambiar a true para debugging de rutas
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64], // Offset para headers fijos
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

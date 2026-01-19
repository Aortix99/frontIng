/**
 * AppModule - Módulo principal de la aplicación
 * Configurado con Clean Code y SOLID principles:
 * - SRP: Un módulo con responsabilidad específica
 * - DIP: Inyección de dependencias mediante providers
 * - OCP: Extensible mediante lazy loading
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Componente principal
import { AppComponent } from './app.component';

// Componentes existentes
import { InicioComponent } from './inicio/inicio.component';
import { ZapataCuadradaAisladaComponent } from './zapata-cuadrada-aislada/zapata-cuadrada-aislada.component';

// Nuevo componente Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Componente de bienvenida
import { WelcomeComponent } from './components/welcome/welcome.component';

// Pipes
import { InicioPipe } from './pipe/inicio.pipe';
import { RazaPipe } from './pipe/raza.pipe';
import { EspeciePipe } from './pipe/especie.pipe';
import { DuenoPipe } from './pipe/dueno.pipe';
import { PacientePipe } from './pipe/paciente.pipe';

// Componentes compartidos
import { ModalComponent } from './shared/modal/modal.component';
import { PdfReportButtonComponent } from './shared/pdf-report-button/pdf-report-button.component';



// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptores
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ZapataExcentricaVigaAmarreComponent } from './zapata-excentrica-viga-amarre/zapata-excentrica-viga-amarre.component';
import { ZapataAisladaComponent } from './zapata-esquinera/zapata-aislada.component';

@NgModule({
  declarations: [
    // Componente principal
    AppComponent,

    // Componentes de funcionalidad existente
    InicioComponent,
    ZapataCuadradaAisladaComponent,

    // Nuevo componente
    DashboardComponent,

    // Componente de bienvenida
    WelcomeComponent,

    // Pipes para transformación de datos
    InicioPipe,
    RazaPipe,
    EspeciePipe,
    DuenoPipe,
    PacientePipe,

    // Componentes compartidos
    ModalComponent,
    PdfReportButtonComponent,
      ZapataExcentricaVigaAmarreComponent,
      ZapataAisladaComponent
  ],
  imports: [
    // Módulos de Angular
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Routing principal
    AppRoutingModule
  ],
  providers: [
    // Guards para protección de rutas
    AuthGuard,

    // Interceptores HTTP
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

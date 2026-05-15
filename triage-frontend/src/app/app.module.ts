import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Módulos de características
import { PacientesModule } from './features/pacientes/pacientes.module';
import { AdminModule } from './features/admin/admin.module';
import { ConfiguracionModule } from './features/configuracion/configuracion.module';
import { ReportesModule } from './features/reportes/reportes.module';
import { HistorialModule } from './features/historial/historial.module';

// Módulos de servicios triage
import { InicioTriageComponent } from './features/triage/pages/inicio/inicio.component';
import { SintomasTriageComponent } from './features/triage/pages/sintomas/sintomas.component';
import { ResultadoTriageComponent } from './features/triage/pages/resultado/resultado.component';
import { SalaEsperaComponent } from './features/triage/pages/sala-espera/sala-espera.component';
import { ValidacionEnfermeriaComponent } from './features/enfermeria/pages/validacion/validacion.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    MainLayoutComponent,
    InicioTriageComponent,
    SintomasTriageComponent,
    ResultadoTriageComponent,
    SalaEsperaComponent,
    ValidacionEnfermeriaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    PacientesModule,
    AdminModule,
    HistorialModule,
    ConfiguracionModule,
    ReportesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { EnfermeroGuard } from './core/guards/enfermero.guard';

import { InicioTriageComponent } from './features/triage/pages/inicio/inicio.component';
import { ValidacionEnfermeriaComponent } from './features/enfermeria/pages/validacion/validacion.component';
import { SintomasTriageComponent } from './features/triage/pages/sintomas/sintomas.component';
import { ResultadoTriageComponent } from './features/triage/pages/resultado/resultado.component';
import { SalaEsperaComponent } from './features/triage/pages/sala-espera/sala-espera.component';
import { ListaPacientesComponent } from './features/pacientes/pages/lista-pacientes/lista-pacientes.component';
import { CrearPacienteComponent } from './features/pacientes/pages/crear-paciente/crear-paciente.component';
import { AdminDashboardComponent } from './features/admin/pages/dashboard/dashboard.component';
import { ReglasComponent } from './features/configuracion/pages/reglas/reglas.component';
import { ReportesComponent } from './features/reportes/pages/reportes/reportes.component';
import { DetailPacienteComponent } from './features/pacientes/pages/detail-paciente/detail-paciente.component';
import { HistorialComponent } from './features/historial/pages/historial.component';

const routes: Routes = [
  // Kiosco público - NO requiere autenticación
  {
    path: 'kiosco',
    loadChildren: () => import('./features/kiosco/kiosco.module').then(m => m.KioscoModule)
  },
  // Login
  { path: 'login', component: LoginComponent },
  // Rutas protegidas
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'triage/inicio', pathMatch: 'full' },
      // Triage - Acceso ambos roles
      { path: 'triage/inicio', component: InicioTriageComponent },
      { path: 'triage/sintomas/:id', component: SintomasTriageComponent },
      { path: 'triage/resultado/:id', component: ResultadoTriageComponent },
      { path: 'triage/sala-espera', component: SalaEsperaComponent },

      // Enfermería - Solo enfermeros
      { path: 'enfermeria/validacion', component: ValidacionEnfermeriaComponent, canActivate: [EnfermeroGuard] },
      // Pacientes
      {
        path: 'pacientes',
        canActivate: [AdminGuard], // ✅ Solo administradores
        children: [
          { path: '', component: ListaPacientesComponent },
          { path: 'nuevo', component: CrearPacienteComponent },
          { path: 'editar/:id', component: CrearPacienteComponent },
          { path: 'detalle/:id', component: DetailPacienteComponent }
        ]
      },
      //- Solo administradores
      {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [AuthGuard, AdminGuard],
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'reglas', component: ReglasComponent },
          { path: 'historial', component: HistorialComponent },
          { path: 'reportes', component: ReportesComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

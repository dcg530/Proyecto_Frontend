// src/app/features/kiosco/kiosco.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Componentes del Kiosco
import { InicioKioscoComponent } from './pages/inicio-kiosco/inicio-kiosco.component';
import { RegistroPacienteComponent } from './pages/registro-paciente/registro-paciente.component';
import { ResultadoKioscoComponent } from './pages/resultado-kiosco/resultado-kiosco.component';
import { SintomasKioscoComponent } from './pages/sintomas-kiosco/sintomas-kiosco.component';
import { KioscoRoutingModule } from '../../kiosco-routing.module';

// Rutas del Kiosco



@NgModule({
  declarations: [
    InicioKioscoComponent,
    RegistroPacienteComponent,
    SintomasKioscoComponent,
    ResultadoKioscoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    KioscoRoutingModule
  ]
})
export class KioscoModule { }

// src/app/features/pacientes/pacientes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ListaPacientesComponent } from './pages/lista-pacientes/lista-pacientes.component';
import { CrearPacienteComponent } from './pages/crear-paciente/crear-paciente.component';
import { DetailPacienteComponent } from './pages/detail-paciente/detail-paciente.component';



@NgModule({
  declarations: [
    ListaPacientesComponent,
    CrearPacienteComponent,
    DetailPacienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,          
    ReactiveFormsModule,   
    RouterModule
  ],
  exports: [
    ListaPacientesComponent,
    CrearPacienteComponent,
    DetailPacienteComponent
  ]
})
export class PacientesModule { }

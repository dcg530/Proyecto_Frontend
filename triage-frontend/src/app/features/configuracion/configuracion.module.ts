// src/app/features/configuracion/configuracion.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReglasComponent } from './pages/reglas/reglas.component';

@NgModule({
  declarations: [
    ReglasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
    exports: [
    ReglasComponent
  ]
})
export class ConfiguracionModule { }

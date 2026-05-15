// src/app/features/reportes/reportes.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportesComponent } from './pages/reportes/reportes.component';

@NgModule({
  declarations: [ReportesComponent],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ReportesModule { }
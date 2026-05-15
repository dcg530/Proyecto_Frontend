// src/app/features/admin/pages/dashboard/dashboard.component.ts (versión simplificada)
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TriageService } from '../../../../core/services/triage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any = null;
  isLoading = false;
  stats = {
    totalPacientes: 0,
    enEspera: 0,
    atendidosHoy: 0
  };

  constructor(
    private authService: AuthService,
    private triageService: TriageService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading = true;
    this.triageService.obtenerColaEspera().subscribe({
      next: (data: any) => {
        this.stats.enEspera = data.estadisticas?.totalEnEspera || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  irAPacientes(): void {
    this.router.navigate(['/pacientes']);
  }

  irAValidacion(): void {
    this.router.navigate(['/enfermeria/validacion']);
  }

  irASalaEspera(): void {
    this.router.navigate(['/triage/sala-espera']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

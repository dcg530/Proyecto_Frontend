import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService, } from '../../../../core/services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { Paciente } from '../../../../shared/models/paciente.model';

@Component({
  selector: 'app-lista-pacientes',
  standalone: false,
  templateUrl: './lista-pacientes.component.html',
  styleUrls: ['./lista-pacientes.component.css']
})

export class ListaPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  isLoading = true;
  searchTerm = '';
  selectedGenero = 'todos';
  selectedEps = 'todas';
  isAdmin = false;
  epsList: string[] = [];

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Administrador');
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.isLoading = true;
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
       console.log("DAtos Paciente: " + data);
        this.pacientes = data;
        this.pacientesFiltrados = data;
        this.extraerFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cargar pacientes');
        this.isLoading = false;
      }
    });
  }

  extraerFiltros(): void {
    const epsSet = new Set<string>();
    this.pacientes.forEach(p => {
      if (p.eps) epsSet.add(p.eps);
    });
    this.epsList = Array.from(epsSet).sort();
  }

  filtrarPacientes(): void {
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      const matchesSearch = this.searchTerm === '' ||
        paciente.identificacion.includes(this.searchTerm) ||
        paciente.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paciente.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesGenero = this.selectedGenero === 'todos' || paciente.genero === this.selectedGenero;
      const matchesEps = this.selectedEps === 'todas' || paciente.eps === this.selectedEps;

      return matchesSearch && matchesGenero && matchesEps;
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/pacientes/detalle', id]);
  }

  editarPaciente(id: number): void {
    this.router.navigate(['/pacientes/editar', id]);
  }

  nuevoPaciente(): void {
    this.router.navigate(['/pacientes/nuevo']);
  }

  getEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.selectedGenero = 'todos';
    this.selectedEps = 'todas';
    this.filtrarPacientes();
  }
}

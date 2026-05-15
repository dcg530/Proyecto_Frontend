import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';
import { Paciente } from '../../../../shared/models/paciente.model';
import { HistorialService } from '../../../../core/services/historial.service';
import { HistorialClinicoResponse } from '../../../../shared/models/historial.model';

@Component({
  selector: 'app-detail-paciente',
  standalone: false,
  templateUrl: './detail-paciente.component.html',
  styleUrls: ['./detail-paciente.component.css']
})
export class DetailPacienteComponent implements OnInit {
  pacienteId: number | null = null;
  paciente: Paciente | null = null;
  historial: any[] = [];
  historialLocal: HistorialClinicoResponse[] = [];  // ✅ Tipado correcto
  historialFHIR: any[] = [];
  isLoading = true;
  isLoadingHistorial = true;
  activeTab: string = 'local';
  isAdmin = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly pacienteService: PacienteService,
    private readonly historialService: HistorialService,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Administrador');
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.pacienteId || isNaN(this.pacienteId)) {  // ✅ Validación mejorada
      this.toastr.error('ID de paciente no válido');
      this.router.navigate(['/pacientes']);
      return;
    }

    this.cargarPaciente();
    this.cargarHistorial();
  }

  cargarPaciente(): void {
    this.isLoading = true;
    console.log(`🔍 Cargando detalle del paciente ID: ${this.pacienteId}`);

    this.pacienteService.getPacienteById(this.pacienteId!).subscribe({
      next: (data) => {
        console.log('✅ Datos del paciente:', data);
        this.paciente = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar paciente:', error);
        this.toastr.error('Error al cargar los datos del paciente');
        this.isLoading = false;

        if (error.status === 404) {
          this.router.navigate(['/pacientes']);
        }
      }
    });
  }

  cargarHistorial(): void {
    // ✅ Verificar que el paciente existe
    if (!this.pacienteId) return;

    this.isLoadingHistorial = true;

    this.pacienteService.getHistorialPaciente(this.pacienteId).subscribe({
      next: (data) => {
        console.log('📜 Respuesta del servidor:', data);

        // Separar los dos tipos de historial
        this.historialLocal = data.historialLocal || [];
        this.historialFHIR = data.historialFHIR || [];

        // Por defecto mostrar el local
        this.historial = this.historialLocal;

        console.log(`📊 Historial: ${this.historialLocal.length} local, ${this.historialFHIR.length} FHIR`);
        this.isLoadingHistorial = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar historial:', error);
        if (error.status !== 404) {
          this.toastr.warning('No se pudo cargar el historial clínico');
        }
        this.isLoadingHistorial = false;
      }
    });
  }

  cambiarTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'local') {
      this.historial = this.historialLocal;
    } else {
      this.historial = this.historialFHIR;
    }
  }

  getEdad(fechaNacimiento: Date): number {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  formatDate(date: string | Date): string {
    if (!date) return 'No registrada';

    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(date: string | Date): string {
    if (!date) return 'No registrada';

    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  volver(): void {
    this.router.navigate(['/pacientes']);
  }

  editar(): void {
    this.router.navigate(['/pacientes/editar', this.pacienteId]);
  }

  nuevoHistorial(): void {
    this.router.navigate(['/pacientes/historial/nuevo', this.pacienteId]);
  }

  editarHistorial(id: number): void {
    this.router.navigate(['/pacientes/historial/editar', id]);
  }

  eliminarHistorial(id: number): void {
    if (confirm('¿Eliminar este registro del historial clínico?')) {
      this.historialService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Registro eliminado correctamente');
          this.cargarHistorial();
        },
        error: (error) => {
          console.error('❌ Error al eliminar:', error);
          this.toastr.error('Error al eliminar el registro');
        }
      });
    }
  }
}

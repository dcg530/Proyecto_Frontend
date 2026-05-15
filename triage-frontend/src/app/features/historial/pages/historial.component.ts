import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { HistorialService } from '../../../core/services/historial.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { HistorialClinicoResponse } from '../../../shared/models/historial.model';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  // Datos
  historiales: HistorialClinicoResponse[] = [];
  pacientes: any[] = [];
  filteredHistoriales: HistorialClinicoResponse[] = [];

  // Estados
  isLoading = false;
  isAdmin = false;
  showModal = false;
  isEditMode = false;
  selectedHistorialId: number | null = null;

  // Filtros
  searchTerm: string = '';
  selectedPacienteId: number | null = null;

  // Formulario
  historialForm: FormGroup;

  constructor(
    private readonly historialService: HistorialService,
    private readonly pacienteService: PacienteService,
    private readonly fb: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) {
    this.historialForm = this.fb.group({
      pacienteId: ['', Validators.required],
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],
      medicamentos: [''],
      alergias: [''],
      antecedentes: ['']
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Administrador');
    this.cargarPacientes();
    this.cargarHistoriales();
  }

  cargarPacientes(): void {
    this.pacienteService.getPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
        console.log('✅ Pacientes cargados:', this.pacientes.length);
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  cargarHistoriales(): void {
    this.isLoading = true;
    console.log('📋 Cargando historiales clínicos...');

    this.historialService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Historiales recibidos:', data);
        this.historiales = data;
        this.filteredHistoriales = [...data];
        console.log('📊 Total de registros:', this.historiales.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar historiales:', error);
        this.toastr.error('Error al cargar historial clínico');
        this.isLoading = false;
      }
    });
  }

  filtrarHistoriales(): void {
    console.log('🔍 Filtrando historiales...');
    console.log('  - Search term:', this.searchTerm);
    console.log('  - Paciente ID:', this.selectedPacienteId);
    console.log('  - Total original:', this.historiales.length);

    if (!this.historiales || this.historiales.length === 0) {
      this.filteredHistoriales = [];
      return;
    }

    this.filteredHistoriales = this.historiales.filter(historial => {
      // Filtro por paciente
      let matchesPaciente = true;
      if (this.selectedPacienteId) {
        matchesPaciente = historial.pacienteId === this.selectedPacienteId;
      }

      // Filtro por búsqueda (nombre del paciente o diagnóstico)
      let matchesSearch = true;
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const searchLower = this.searchTerm.toLowerCase().trim();
        const pacienteNombre = (historial.pacienteNombre || '').toLowerCase();
        const diagnostico = (historial.diagnostico || '').toLowerCase();
        matchesSearch = pacienteNombre.includes(searchLower) || diagnostico.includes(searchLower);
      }

      return matchesPaciente && matchesSearch;
    });

    console.log('  - Resultado filtrado:', this.filteredHistoriales.length);
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.selectedPacienteId = null;
    this.filtrarHistoriales();
    this.toastr.info('Filtros limpiados');
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.selectedHistorialId = null;
    this.historialForm.reset();
    this.showModal = true;
  }

  editarHistorial(historial: HistorialClinicoResponse): void {
    this.isEditMode = true;
    this.selectedHistorialId = historial.id;
    this.historialForm.patchValue({
      pacienteId: historial.pacienteId,
      diagnostico: historial.diagnostico,
      medicamentos: historial.medicamentos,
      alergias: historial.alergias,
      antecedentes: historial.antecedentes
    });
    this.showModal = true;
  }

  guardarHistorial(): void {
    if (this.historialForm.invalid) {
      this.toastr.warning('Complete todos los campos requeridos');
      return;
    }

    const data = this.historialForm.value;
    this.isLoading = true;

    if (this.isEditMode && this.selectedHistorialId) {
      const updateData = {
        diagnostico: data.diagnostico,
        medicamentos: data.medicamentos,
        alergias: data.alergias,
        antecedentes: data.antecedentes
      };

      this.historialService.update(this.selectedHistorialId, updateData).subscribe({
        next: () => {
          this.toastr.success('Historial actualizado correctamente');
          this.cargarHistoriales();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error?.mensaje || 'Error al actualizar');
          this.isLoading = false;
        }
      });
    } else {
      this.historialService.create(data).subscribe({
        next: () => {
          this.toastr.success('Historial creado correctamente');
          this.cargarHistoriales();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error?.mensaje || 'Error al crear historial');
          this.isLoading = false;
        }
      });
    }
  }

  eliminarHistorial(id: number, pacienteNombre: string): void {
    if (confirm(`¿Eliminar el historial clínico de ${pacienteNombre}?`)) {
      this.historialService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Historial eliminado correctamente');
          this.cargarHistoriales();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error al eliminar historial');
        }
      });
    }
  }

  cerrarModal(): void {
    this.showModal = false;
    this.historialForm.reset();
  }

  getNombrePaciente(pacienteId: number): string {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Desconocido';
  }

  recargarDatos(): void {
    console.log('🔄 Recargando datos...');
    this.cargarHistoriales();
    this.cargarPacientes();
  }
}

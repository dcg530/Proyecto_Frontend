// src/app/features/pacientes/pages/crear-paciente/crear-paciente.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../../core/services/paciente.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-crear-paciente',
  standalone: false,
  templateUrl: './crear-paciente.component.html',
  styleUrls: ['./crear-paciente.component.css']
})
export class CrearPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  isEditMode = false;
  pacienteId: number | null = null;
  isLoading = false;
  titulo = 'Nuevo Paciente';

  epsList = ['Sanitas', 'NuevaEPS', 'Famisanar', 'Sura', 'Compensar', 'SaludTotal', 'Coomeva', 'Cruz Blanca', 'Medimas'];
  generos = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.pacienteForm = this.fb.group({
      identificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: ['', Validators.required],
      eps: ['', Validators.required],
      telefono: ['', Validators.pattern(/^[0-9]{7,15}$/)],
      correo: ['', Validators.email],
      direccion: [''],
      genero: ['']
    });
  }

  ngOnInit(): void {
    if (!this.authService.hasRole('Administrador')) {
      this.toastr.error('No tiene permisos para acceder a esta página');
      this.router.navigate(['/pacientes']);
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pacienteId = Number.parseInt(id);
      this.titulo = 'Editar Paciente';
      this.cargarPaciente();
    }
  }

  cargarPaciente(): void {
    if (!this.pacienteId) {
      this.toastr.warning('ID de paciente no válido');
      return;
    }

    this.isLoading = true;
    console.log(`📋 Cargando paciente con ID: ${this.pacienteId}`);

    this.pacienteService.getPacienteById(this.pacienteId).subscribe({
      next: (data) => {
        console.log('Paciente cargado exitosamente:', data);

        // Verificar que los datos existen
        if (!data) {
          this.toastr.error('No se encontraron datos del paciente');
          this.router.navigate(['/pacientes']);
          return;
        }

        // Formatear la fecha correctamente
        let fechaFormateada = '';
        if (data.fechaNacimiento) {
          fechaFormateada = this.formatDate(data.fechaNacimiento);
          console.log(`Fecha de nacimiento formateada: ${fechaFormateada}`);
        }

        // Actualizar el formulario con los datos del paciente
        this.pacienteForm.patchValue({
          identificacion: data.identificacion || '',
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          fechaNacimiento: fechaFormateada,
          eps: data.eps || '',
          telefono: data.telefono || '',
          correo: data.correo || '',
          direccion: data.direccion || '',
          genero: data.genero || ''
        });

        console.log('Formulario actualizado:', this.pacienteForm.value);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar paciente:', error);

        // Manejar diferentes tipos de errores
        if (error.status === 404) {
          this.toastr.error(`Paciente con ID ${this.pacienteId} no encontrado`);
          this.router.navigate(['/pacientes']);
        } else if (error.status === 401) {
          this.toastr.error('Sesión expirada. Por favor inicie sesión nuevamente');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.toastr.error('No tiene permisos para editar pacientes');
          this.router.navigate(['/pacientes']);
        } else {
          this.toastr.error('Error al cargar los datos del paciente');
        }

        this.isLoading = false;
      }
    });
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.pacienteForm.invalid) {
      this.toastr.warning('Complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const data = this.pacienteForm.value;

    if (this.isEditMode && this.pacienteId) {
      this.pacienteService.actualizarPaciente(this.pacienteId, data).subscribe({
        next: () => {
          this.toastr.success('Paciente actualizado correctamente');
          this.router.navigate(['/pacientes']);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error?.mensaje || 'Error al actualizar');
          this.isLoading = false;
        }
      });
    } else {
      this.pacienteService.crearPaciente(data).subscribe({
        next: () => {
          this.toastr.success('Paciente creado correctamente');
          this.router.navigate(['/pacientes']);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.error?.mensaje || 'Error al crear paciente');
          this.isLoading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pacientes']);
  }
}

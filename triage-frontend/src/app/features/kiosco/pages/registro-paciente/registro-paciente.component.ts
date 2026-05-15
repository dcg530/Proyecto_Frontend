// src/app/features/kiosco/pages/registro-paciente/registro-paciente.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KioscoService } from '../../../../core/services/kiosco.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-paciente',
  standalone: false,
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {
  registroForm: FormGroup;
  isLoading = false;
  identificacionPrefill = '';
  epsPrefill = '';
  epsList = ['Sanitas', 'NuevaEPS', 'Sura', 'Compensar', 'SaludTotal', 'Coomeva', 'Cruz Blanca', 'Medimas'];
  constructor(
    private readonly  fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly kioscoService: KioscoService,
    private readonly toastr: ToastrService
  ) {
    this.registroForm = this.fb.group({
      identificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required, this.validarEdad]],
      eps: ['', Validators.required],
      telefono: ['', Validators.pattern(/^[0-9]{7,15}$/)],
      correo: ['', [Validators.email, Validators.maxLength(100)]],
      genero: ['']
    });
  }

  // Validador personalizado para edad (mayor de 0 años)
  validarEdad(control: any): { [key: string]: boolean } | null {
    if (!control.value) return null;
    const fechaNac = new Date(control.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    if (edad < 0 || edad > 120) {
      return { edadInvalida: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.identificacionPrefill = this.route.snapshot.queryParams['identificacion'] || '';
    this.epsPrefill = this.route.snapshot.queryParams['eps'] || '';

    if (this.identificacionPrefill) {
      this.registroForm.patchValue({ identificacion: this.identificacionPrefill });
      this.registroForm.get('identificacion')?.disable();
    }
    if (this.epsPrefill) {
      this.registroForm.patchValue({ eps: this.epsPrefill });
    }
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      // Mostrar errores específicos
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}`, control.errors);
        }
      });
      this.toastr.warning('Complete todos los campos requeridos correctamente');
      return;
    }

    this.isLoading = true;
    const formValues = this.registroForm.getRawValue();

    this.kioscoService.crearPaciente(formValues).subscribe({
      next: (response) => {
        console.log('✅ Paciente registrado:', response);
        this.toastr.success('Paciente registrado correctamente');

        // Iniciar triage automáticamente
        this.kioscoService.iniciarTriage(formValues.identificacion, formValues.eps).subscribe({
          next: (triageResponse) => {
            console.log('✅ Triage iniciado:', triageResponse);
            localStorage.setItem('triageId', triageResponse.triageId.toString());
            this.router.navigate(['/kiosco/sintomas', triageResponse.triageId]);
          },
          error: (error) => {
            console.error('❌ Error al iniciar triage:', error);
            this.toastr.error('Error al iniciar el proceso de triage');
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ Error al registrar:', error);
        this.toastr.error(error.error?.mensaje || 'Error al registrar paciente');
        this.isLoading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/kiosco']);
  }
}

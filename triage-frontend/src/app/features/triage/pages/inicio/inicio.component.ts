// src/app/features/triage/pages/inicio/inicio.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TriageService } from '../../../../core/services/triage.service';
import { PacienteService } from '../../../../core/services/paciente.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inicio-triage',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioTriageComponent implements OnInit {
  formulario!: FormGroup;
  isLoading = false;
  pacienteNoEncontrado = false;
  identificacionBuscada = '';
  epsList = ['Sanitas', 'Famisanar', 'NuevaEPS', 'Sura', 'Compensar', 'SaludTotal', 'Coomeva'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly triageService: TriageService,
    private readonly pacienteService: PacienteService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.resetFormulario();
  }

  resetFormulario(): void {
    this.formulario = this.fb.group({
      identificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      eps: ['', Validators.required]
    });
    this.pacienteNoEncontrado = false;
    this.identificacionBuscada = '';
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.toastr.warning('Por favor complete todos los campos');
      return;
    }

    this.isLoading = true;
    this.pacienteNoEncontrado = false;

    const identificacion = this.formulario.get('identificacion')?.value;
    const eps = this.formulario.get('eps')?.value;

    // Primero verificar si el paciente existe
    this.pacienteService.getPacienteByIdentificacion(identificacion).subscribe({
      next: (response) => {
        console.log('✅ Paciente encontrado:', response);
        // Paciente existe, proceder con el triage
        this.iniciarTriage(identificacion, eps);
      },
      error: (error) => {
        if (error.status === 404) {
          console.log('❌ Paciente no encontrado');
          this.pacienteNoEncontrado = true;
          this.identificacionBuscada = identificacion;
          this.isLoading = false;
          this.toastr.warning('Paciente no registrado en el sistema');
        } else {
          console.error(error);
          this.toastr.error('Error al verificar el paciente');
          this.isLoading = false;
        }
      }
    });
  }

  iniciarTriage(identificacion: string, eps: string): void {
    this.triageService.iniciarTriage({ identificacion, eps }).subscribe({
      next: (response) => {
        localStorage.setItem('triageId', response.triageId.toString());
        this.toastr.success('Paciente validado correctamente');
        this.router.navigate(['/triage/sintomas', response.triageId]);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error?.mensaje || 'Error al iniciar el triage');
        this.isLoading = false;
      }
    });
  }

  nuevoIntento(): void {
    this.resetFormulario();
  }
}

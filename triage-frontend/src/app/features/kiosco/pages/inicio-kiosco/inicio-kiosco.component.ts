import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KioscoService } from '../../../../core/services/kiosco.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inicio-kiosco',
  standalone: false,
  templateUrl: './inicio-kiosco.component.html',
  styleUrls: ['./inicio-kiosco.component.css']
})
export class InicioKioscoComponent {
  identificacionForm: FormGroup;
  isLoading = false;
  pacienteEncontrado: any = null;
  mostrarRegistro = false;
  epsList = ['Sanitas', 'NuevaEPS', 'Famisanar', 'Sura', 'Compensar', 'SaludTotal', 'Coomeva', 'Cruz Blanca', 'Medimas'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly kioscoService: KioscoService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.identificacionForm = this.fb.group({
      identificacion: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      eps: ['', Validators.required]
    });
  }

  verificarPaciente(): void {
    if (this.identificacionForm.invalid) {
      this.toastr.warning('Complete todos los campos');
      return;
    }

    this.isLoading = true;
    this.pacienteEncontrado = null;
    this.mostrarRegistro = false;

    const identificacion = this.identificacionForm.get('identificacion')?.value;

    this.kioscoService.verificarPaciente(identificacion).subscribe({
      next: (response) => {
        console.log('✅ Paciente encontrado:', response);
        this.pacienteEncontrado = response.paciente;
        this.mostrarRegistro = false;
        this.isLoading = false;
        this.toastr.success('Paciente encontrado', '¡Bienvenido!');

        // Auto-continuar después de 2 segundos
        setTimeout(() => {
          this.continuarConPacienteExistente();
        }, 2000);
      },
      error: (error) => {
        console.log('❌ Paciente no encontrado:', error);
        if (error.status === 404) {
          this.mostrarRegistro = true;
          this.pacienteEncontrado = null;
          this.isLoading = false;
          this.toastr.info('Paciente no registrado', 'Complete el formulario de registro');
        } else {
          this.toastr.error('Error al verificar el paciente');
          this.isLoading = false;
        }
      }
    });
  }

  continuarConPacienteExistente(): void {
    const eps = this.identificacionForm.get('eps')?.value;
    const identificacion = this.identificacionForm.get('identificacion')?.value;

    this.kioscoService.iniciarTriage(identificacion, eps).subscribe({
      next: (response) => {
        localStorage.setItem('triageId', response.triageId.toString());
        localStorage.setItem('pacienteIdentificacion', identificacion);
        this.router.navigate(['/kiosco/sintomas', response.triageId]);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al iniciar el proceso de triage');
      }
    });
  }
}

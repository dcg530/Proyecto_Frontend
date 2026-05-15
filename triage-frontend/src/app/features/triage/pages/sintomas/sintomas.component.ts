
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TriageService } from '../../../../core/services/triage.service';
import { ToastrService } from 'ngx-toastr';
import { SintomasRequest } from '../../../../shared/models/triage.model';

@Component({
  selector: 'app-sintomas-triage',
  standalone: false,
  templateUrl: './sintomas.component.html',
  styleUrls: ['./sintomas.component.css']
})
export class SintomasTriageComponent implements OnInit {
  triageId: number = 0;
  step = 1;
  sintomasForm: FormGroup;
  signosVitalesForm: FormGroup;
  isLoading = false;

  sintomasComunes = [
    'Dolor de cabeza', 'Dolor de pecho', 'Dificultad para respirar',
    'Dolor abdominal', 'Fiebre', 'Vómito', 'Diarrea', 'Mareo',
    'Fractura', 'Herida', 'Quemadura', 'Convulsión', 'Desmayo'
  ];

  escalaDolor = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private triageService: TriageService,
    private toastr: ToastrService
  ) {
    this.sintomasForm = this.fb.group({
      descripcion: ['', Validators.required],
      dolorEscala: ['']
    });

    this.signosVitalesForm = this.fb.group({
      frecuenciaCardiaca: ['', [Validators.min(30), Validators.max(200)]],
      presionArterialSistolica: ['', [Validators.min(50), Validators.max(250)]],
      presionArterialDiastolica: ['', [Validators.min(30), Validators.max(150)]],
      temperatura: ['', [Validators.min(32), Validators.max(45)]],
      saturacionOxigeno: ['', [Validators.min(50), Validators.max(100)]],
      frecuenciaRespiratoria: ['', [Validators.min(5), Validators.max(60)]]
    });
  }

  ngOnInit(): void {
    this.triageId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.triageId) {
      this.router.navigate(['/triage/inicio']);
      this.toastr.error('ID de triage no válido');
    }
  }

  seleccionarSintoma(sintoma: string): void {
    const current = this.sintomasForm.get('descripcion')?.value || '';
    const nuevo = current ? `${current}, ${sintoma}` : sintoma;
    this.sintomasForm.patchValue({ descripcion: nuevo });
  }

  siguienteStep(): void {
    if (this.step === 1 && this.sintomasForm.valid) {
      this.step = 2;
    } else if (this.step === 2) {
      this.enviarClasificacion();
    }
  }

  enviarClasificacion(): void {
    this.isLoading = true;

    const sintomas: SintomasRequest = {
      descripcion: this.sintomasForm.value.descripcion,
      dolorEscala: this.sintomasForm.value.dolorEscala,
      ...this.signosVitalesForm.value
    };

    this.triageService.registrarSintomas(this.triageId, sintomas).subscribe({
      next: (response) => {
        localStorage.setItem('clasificacion', JSON.stringify(response));
        this.router.navigate(['/triage/resultado', this.triageId]);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.error?.mensaje || 'Error al procesar los síntomas');
        this.isLoading = false;
      }
    });
  }

  volver(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/triage/inicio']);
    }
  }
}

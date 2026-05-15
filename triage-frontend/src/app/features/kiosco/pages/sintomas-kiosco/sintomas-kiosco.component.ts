import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { KioscoService } from '../../../../core/services/kiosco.service';
import { SintomasKioscoRequest } from '../../../../shared/models/kiosco.model';

@Component({
  selector: 'app-sintomas-kiosco',
  standalone: false,
  templateUrl: './sintomas-kiosco.component.html',
  styleUrls: ['./sintomas-kiosco.component.css']
})
export class SintomasKioscoComponent implements OnInit {
  triageId: number = 0;
  step = 1;
  sintomasForm: FormGroup;
  signosVitalesForm: FormGroup;
  isLoading = false;

  sintomasComunes = [
    'Dolor de cabeza', 'Dolor de pecho', 'Dificultad para respirar',
    'Dolor abdominal', 'Fiebre', 'Vómito', 'Diarrea', 'Mareo',
    'Fractura', 'Herida', 'Quemadura', 'Convulsión', 'Desmayo',
    'Visión borrosa', 'Hormigueo', 'Debilidad', 'Palpitaciones'
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly kioscoService: KioscoService,
    private readonly toastr: ToastrService
  ) {
    this.sintomasForm = this.fb.group({
      descripcion: ['', Validators.required],
      dolorEscala: ['0']
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
      this.router.navigate(['/kiosco']);
      this.toastr.error('ID de triage no válido');
    }
  }

  seleccionarSintoma(sintoma: string): void {
    const current = this.sintomasForm.get('descripcion')?.value || '';
    if (current.includes(sintoma)) {
      // Eliminar si ya existe
      const sintomasList = current.split(', ').filter((s: string) => s !== sintoma);
      this.sintomasForm.patchValue({ descripcion: sintomasList.join(', ') });
    } else {
      // Agregar si no existe
      const nuevo = current ? `${current}, ${sintoma}` : sintoma;
      this.sintomasForm.patchValue({ descripcion: nuevo });
    }
  }

  siguienteStep(): void {
    if (this.step === 1 && this.sintomasForm.valid) {
      this.step = 2;
      this.toastr.info('Ahora complete sus signos vitales');
    } else if (this.step === 2) {
      this.enviarClasificacion();
    }
  }

  volver(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/kiosco']);
    }
  }

  enviarClasificacion(): void {
    this.isLoading = true;

    const sintomasRequest: any = {
      descripcion: this.sintomasForm.value.descripcion,
      dolorEscala: this.sintomasForm.value.dolorEscala,
      antecedentes: [],
      alergias: []
    };

    // Solo agregar campos que tengan valor válido
    const frecuenciaCardiaca = this.signosVitalesForm.value.frecuenciaCardiaca;
    if (frecuenciaCardiaca !== null && frecuenciaCardiaca !== undefined && frecuenciaCardiaca !== '') {
      sintomasRequest.frecuenciaCardiaca = Number(frecuenciaCardiaca);
    }

    const presionSistolica = this.signosVitalesForm.value.presionArterialSistolica;
    if (presionSistolica !== null && presionSistolica !== undefined && presionSistolica !== '') {
      sintomasRequest.presionArterialSistolica = Number(presionSistolica);
    }

    const presionDiastolica = this.signosVitalesForm.value.presionArterialDiastolica;
    if (presionDiastolica !== null && presionDiastolica !== undefined && presionDiastolica !== '') {
      sintomasRequest.presionArterialDiastolica = Number(presionDiastolica);
    }

    const temperatura = this.signosVitalesForm.value.temperatura;
    if (temperatura !== null && temperatura !== undefined && temperatura !== '') {
      sintomasRequest.temperatura = Number(temperatura);
    }

    const saturacion = this.signosVitalesForm.value.saturacionOxigeno;
    if (saturacion !== null && saturacion !== undefined && saturacion !== '') {
      sintomasRequest.saturacionOxigeno = Number(saturacion);
    }

    const frecuenciaResp = this.signosVitalesForm.value.frecuenciaRespiratoria;
    if (frecuenciaResp !== null && frecuenciaResp !== undefined && frecuenciaResp !== '') {
      sintomasRequest.frecuenciaRespiratoria = Number(frecuenciaResp);
    }

    console.log('📤 Enviando datos limpios:', JSON.stringify(sintomasRequest, null, 2));

    this.kioscoService.registrarSintomas(this.triageId, sintomasRequest).subscribe({
      next: (response) => {
        console.log('✅ Clasificación recibida:', response);
        localStorage.setItem('clasificacion', JSON.stringify(response));
        this.router.navigate(['/kiosco/resultado', this.triageId]);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.toastr.error(error.error?.mensaje || 'Error al procesar los síntomas');
        this.isLoading = false;
      }
    });
  }
}

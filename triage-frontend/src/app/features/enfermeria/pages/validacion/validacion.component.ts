import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TriageService } from '../../../../core/services/triage.service';
import { SignalRService } from '../../../../core/services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// Definir NivelesTriage aquí temporalmente para evitar dependencias
const NivelesTriage = [
  { nivel: 1, nombre: 'Crítico - Reanimación', color: '#FF0000', tiempoMax: 0, icon: '🚨' },
  { nivel: 2, nombre: 'Emergencia', color: '#FF6600', tiempoMax: 10, icon: '⚠️' },
  { nivel: 3, nombre: 'Urgencia', color: '#FFCC00', tiempoMax: 60, icon: '🟡' },
  { nivel: 4, nombre: 'Menos Urgente', color: '#00CC00', tiempoMax: 180, icon: '🟢' },
  { nivel: 5, nombre: 'No Urgente', color: '#0066CC', tiempoMax: 240, icon: '🔵' }
];

@Component({
  selector: 'app-validacion-enfermeria',
  standalone: false,  // ← IMPORTANTE: Debe ser false o no tener la propiedad
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.css']
})

export class ValidacionEnfermeriaComponent implements OnInit, OnDestroy {
  pacientesPendientes: any[] = [];
  pacienteSeleccionado: any = null;
  formularioValidacion!: FormGroup;
  isLoading = false;
  nivelesTriage = NivelesTriage;
  enfermeroId: number = 1;

  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    private readonly triageService: TriageService,
    private readonly signalR: SignalRService,
    private  fb: FormBuilder,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.formularioValidacion = this.fb.group({
      nivelValidado: ['', Validators.required],
      observaciones: ['']
    });

    this.cargarPacientesPendientes();
    this.escucharEventosSignalR();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarPacientesPendientes(): void {
    this.triageService.obtenerDetalleCola().subscribe({
      next: (data) => {
        this.pacientesPendientes = data.filter((p: any) =>
          p.estado === 'PENDIENTE' || p.estado === ''
        );
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  private escucharEventosSignalR(): void {
    this.subscriptions.add(
      this.signalR.nuevoPaciente$.subscribe(() => {
        this.cargarPacientesPendientes();
      })
    );
  }

  seleccionarPaciente(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    this.formularioValidacion.reset();
    this.formularioValidacion.patchValue({
      nivelValidado: paciente.nivelTriage || 3
    });
  }

  validarPaciente(): void {
    if (!this.formularioValidacion.valid) {
      return;
    }

    this.isLoading = true;

    const request = {
      enfermeroId: this.enfermeroId,
      nivelValidado: this.formularioValidacion.value.nivelValidado,
      observaciones: this.formularioValidacion.value.observaciones
    };

    this.triageService.validarTriage(this.pacienteSeleccionado.id, request)
      .subscribe({
        next: () => {
          this.toastr.success('Paciente validado exitosamente');
          this.pacienteSeleccionado = null;
          this.cargarPacientesPendientes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  getColorNivel(nivel: number): string {
    const nivelInfo = this.nivelesTriage.find(n => n.nivel === nivel);
    return nivelInfo?.color || '#6c757d';
  }

  getTiempoTexto(tiempoMinutos: number): string {
    if (tiempoMinutos < 1) return 'Recién llegado';
    if (tiempoMinutos < 60) return `${tiempoMinutos} min`;
    const horas = Math.floor(tiempoMinutos / 60);
    const minutos = tiempoMinutos % 60;
    return `${horas}h ${minutos}min`;
  }
}

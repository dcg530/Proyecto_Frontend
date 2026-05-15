// src/app/features/triage/pages/sala-espera/sala-espera.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TriageService } from '../../../../core/services/triage.service';
import { SignalRService } from '../../../../core/services/signalr.service';
import { NivelesTriage, ColaResponse } from '../../../../shared/models/triage.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sala-espera',
  standalone: false,
  templateUrl: './sala-espera.component.html',
  styleUrls: ['./sala-espera.component.css']  // Cambiar a .css
})
export class SalaEsperaComponent implements OnInit, OnDestroy {
  colaData: ColaResponse | null = null;
  detalleCola: any[] = [];
  isLoading = true;
  ultimaActualizacion: Date = new Date();
  nivelesTriage = NivelesTriage;

  private subscriptions: Subscription = new Subscription();
  private refreshInterval: any;

  constructor(
    private triageService: TriageService,
    private signalR: SignalRService
  ) {}

  ngOnInit(): void {
    this.cargarColaEspera();  // Método público
    this.iniciarActualizacionAutomatica();
    this.escucharEventosSignalR();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.subscriptions.unsubscribe();
  }

  // Cambiar a público
  cargarColaEspera(): void {
    this.isLoading = true;

    this.triageService.obtenerColaEspera().subscribe({
      next: (data) => {
        this.colaData = data;
        this.ultimaActualizacion = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar cola:', error);
        this.isLoading = false;
      }
    });

    this.triageService.obtenerDetalleCola().subscribe({
      next: (data) => {
        this.detalleCola = data;
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
      }
    });
  }

  private iniciarActualizacionAutomatica(): void {
    this.refreshInterval = setInterval(() => {
      this.cargarColaEspera();
    }, 30000);
  }

  private escucharEventosSignalR(): void {
    this.subscriptions.add(
      this.signalR.colaActualizada$.subscribe(() => {
        this.cargarColaEspera();
      })
    );

    this.subscriptions.add(
      this.signalR.triageValidado$.subscribe(() => {
        this.cargarColaEspera();
      })
    );
  }

  getColorNivel(nivel: number): string {
    const nivelInfo = this.nivelesTriage.find(n => n.nivel === nivel);
    return nivelInfo?.color || '#6c757d';
  }

  getIconoNivel(nivel: number): string {
    const nivelInfo = this.nivelesTriage.find(n => n.nivel === nivel);
    return nivelInfo?.icon || '🏥';
  }

  getTiempoTexto(tiempoMinutos: number): string {
    if (tiempoMinutos < 1) return 'Menos de 1 minuto';
    if (tiempoMinutos < 60) return `${tiempoMinutos} minutos`;
    const horas = Math.floor(tiempoMinutos / 60);
    const minutos = tiempoMinutos % 60;
    return `${horas}h ${minutos}min`;
  }

  obtenerEstadisticas(): any {
    if (!this.colaData?.estadisticas) return null;
    return this.colaData.estadisticas;
  }

  // Método seguro para acceder a porNivel
  getPorNivel(nivel: number): number {
    if (!this.colaData?.estadisticas?.porNivel) return 0;
    const key = `nivel${nivel}` as keyof typeof this.colaData.estadisticas.porNivel;
    return this.colaData.estadisticas.porNivel[key] || 0;
  }
}

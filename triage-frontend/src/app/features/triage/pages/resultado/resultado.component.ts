import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TriageService } from '../../../../core/services/triage.service';
import { SignalRService } from '../../../../core/services/signalr.service';
import { NivelesTriage } from '../../../../shared/models/triage.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resultado-triage',
  standalone: false,
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.css']
})
export class ResultadoTriageComponent implements OnInit, OnDestroy {
  triageId: number = 0;
  clasificacion: any = null;
  nivelInfo: any = null;
  tiempoRestante: number = 0;
  private intervalId: any;
  private readonly subscriptions: Subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    public readonly router: Router,
    private readonly triageService: TriageService,
    private readonly signalR: SignalRService
  ) { }

  ngOnInit(): void {
    this.triageId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.triageId) {
      this.router.navigate(['/triage/inicio']);
      return;
    }

    // Obtener clasificación del localStorage
    const saved = localStorage.getItem('clasificacion');
    if (saved) {
      this.clasificacion = JSON.parse(saved);
      this.nivelInfo = NivelesTriage.find(n => n.nivel === this.clasificacion.nivelTriage);
      this.tiempoRestante = this.clasificacion.tiempoEstimadoEspera;
      this.iniciarContador();
    } else {
      this.cargarClasificacion();
    }

    this.escucharEventosSignalR();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscriptions.unsubscribe();
  }

  private cargarClasificacion(): void {
    this.triageService.obtenerTriage(this.triageId).subscribe({
      next: (data) => {
        this.clasificacion = {
          nivelTriage: data.nivelTriage,
          recomendacion: data.recomendacion,
          tiempoEstimadoEspera: data.tiempoAtencionMinutos || 30,
          numeroTurno: data.numeroTurno
        };
        this.nivelInfo = NivelesTriage.find(n => n.nivel === this.clasificacion.nivelTriage);
        this.tiempoRestante = this.clasificacion.tiempoEstimadoEspera;
        this.iniciarContador();
      },
      error: () => {
        this.router.navigate(['/triage/inicio']);
      }
    });
  }

  private iniciarContador(): void {
    if (this.tiempoRestante > 0) {
      this.intervalId = setInterval(() => {
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--;
        } else {
          clearInterval(this.intervalId);
        }
      }, 60000); // Actualizar cada minuto
    }
  }

  private escucharEventosSignalR(): void {
    this.subscriptions.add(
      this.signalR.triageValidado$.subscribe((data) => {
        if (data.triageId === this.triageId) {
          this.toastr.success(`Su triage ha sido validado. Nuevo nivel: ${data.nivelValidado}`);
          this.cargarClasificacion();
        }
      })
    );
  }

  verColaEspera(): void {
    this.router.navigate(['/triage/sala-espera']);
  }

  imprimirTurno(): void {
    const contenido = `
      <div style="text-align: center; padding: 20px;">
        <h2>🏥 Sistema de Triage Inteligente</h2>
        <h3>Sanitas - Centro Industrial</h3>
        <div style="margin: 30px 0;">
          <div style="font-size: 48px; font-weight: bold;">${this.clasificacion.numeroTurno}</div>
          <div style="font-size: 24px; margin-top: 10px;">Nivel ${this.clasificacion.nivelTriage}</div>
        </div>
        <p>${this.clasificacion.recomendacion}</p>
        <hr>
        <small>Fecha: ${new Date().toLocaleString()}</small>
      </div>
    `;

    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenido);
      ventana.print();
      ventana.close();
    }
  }

  getColorNivel(nivel: number): string {
    const nivelInfo = NivelesTriage.find(n => n.nivel === nivel);
    return nivelInfo?.color || '#6c757d';
  }

  protected readonly toastr: any;
}

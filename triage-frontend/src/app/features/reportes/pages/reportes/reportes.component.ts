// src/app/features/reportes/pages/reportes/reportes.component.ts
import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../../core/services/reporte.service';
import { ToastrService } from 'ngx-toastr';
import { DemandaDiariaResponse, EficienciaTriajeResponse, SaturacionServicioResponse, TiemposAtencionResponse } from '../../../../shared/models/reportes.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  // Fechas - usar strings para el input date
  fechaInicio: string = '';
  fechaFin: string = '';
  fechaDemanda: string = '';

  // Datos de reportes
  demandaData: DemandaDiariaResponse | null = null;
  saturacionData: SaturacionServicioResponse | null = null;
  tiemposData: TiemposAtencionResponse | null = null;
  eficienciaData: EficienciaTriajeResponse | null = null;

  // Estados de carga
  loadingDemanda = false;
  loadingSaturacion = false;
  loadingTiempos = false;
  loadingEficiencia = false;
  loadingExport = false;

  // Pestaña activa
  activeTab = 'demanda';

  // Niveles para mostrar en el template
  niveles = [
    { id: 1, nombre: 'Nivel 1', color: '#FF0000' },
    { id: 2, nombre: 'Nivel 2', color: '#FF6600' },
    { id: 3, nombre: 'Nivel 3', color: '#FFCC00' },
    { id: 4, nombre: 'Nivel 4', color: '#00CC00' },
    { id: 5, nombre: 'Nivel 5', color: '#0066CC' }
  ];

  constructor(
    private readonly reporteService: ReporteService,
    private readonly toastr: ToastrService,
    private readonly authService: AuthService
  ) {
    // Inicializar fechas
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaInicio = this.formatDateYMD(hace30Dias);
    this.fechaFin = this.formatDateYMD(hoy);
    this.fechaDemanda = this.formatDateYMD(hoy);

    console.log('📅 Fechas inicializadas:', {
      fechaDemanda: this.fechaDemanda,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    });
  }

  ngOnInit(): void {
    this.cargarDemandaDiaria();
    this.cargarSaturacionServicio();
    this.cargarTiemposAtencion();
    this.cargarEficienciaTriaje();
  }

  // Formato YYYY-MM-DD para input date
  formatDateYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formato DD/MM/YYYY para mostrar
  formatDateDMY(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  // Formato legible completo
  formatDateReadable(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cargarDemandaDiaria(): void {
    if (!this.fechaDemanda) {
      this.fechaDemanda = this.formatDateYMD(new Date());
    }

    this.loadingDemanda = true;
    const fecha = new Date(this.fechaDemanda);

    console.log('📅 Consultando demanda para fecha:', this.fechaDemanda);

    this.reporteService.getDemandaDiaria(fecha).subscribe({
      next: (data) => {
        console.log('📊 Datos de demanda recibidos:', data);
        this.demandaData = data;
        this.loadingDemanda = false;

        if (data && data.totalPacientes === 0) {
          this.toastr.info(`No hay pacientes registrados para el ${this.formatDateDMY(this.fechaDemanda)}`);
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar demanda diaria:', error);
        this.toastr.error('Error al cargar demanda diaria');
        this.loadingDemanda = false;
      }
    });
  }

  cargarDemandaHoy(): void {
    this.fechaDemanda = this.formatDateYMD(new Date());
    this.cargarDemandaDiaria();
    this.toastr.info('Consultando datos del día de hoy');
  }

  actualizarDemanda(): void {
    if (!this.fechaDemanda) {
      this.fechaDemanda = this.formatDateYMD(new Date());
    }
    this.cargarDemandaDiaria();
  }

  cargarSaturacionServicio(): void {
    this.loadingSaturacion = true;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    this.reporteService.getSaturacionServicio(inicio, fin).subscribe({
      next: (data) => {
        this.saturacionData = data;
        this.loadingSaturacion = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cargar saturación del servicio');
        this.loadingSaturacion = false;
      }
    });
  }

  cargarTiemposAtencion(): void {
    this.loadingTiempos = true;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    this.reporteService.getTiemposAtencion(inicio, fin).subscribe({
      next: (data) => {
        this.tiemposData = data;
        this.loadingTiempos = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cargar tiempos de atención');
        this.loadingTiempos = false;
      }
    });
  }

  cargarEficienciaTriaje(): void {
    this.loadingEficiencia = true;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    this.reporteService.getEficienciaTriaje(inicio, fin).subscribe({
      next: (data) => {
        this.eficienciaData = data;
        this.loadingEficiencia = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cargar eficiencia del triaje');
        this.loadingEficiencia = false;
      }
    });
  }

  actualizarReportes(): void {
    this.cargarSaturacionServicio();
    this.cargarTiemposAtencion();
    this.cargarEficienciaTriaje();
  }

  exportarCSV(): void {
    this.loadingExport = true;
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    this.reporteService.exportarCSV(inicio, fin).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_triage_${this.fechaInicio}_${this.fechaFin}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Reporte exportado exitosamente');
        this.loadingExport = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al exportar reporte');
        this.loadingExport = false;
      }
    });
  }

  getPorcentaje(valor: number, total: number): number {
    if (total === 0 || !valor) return 0;
    return Math.round((valor / total) * 100);
  }

  getDistribucionNivel(nivel: number): number {
    if (!this.demandaData || !this.demandaData.distribucionPorNivel) return 0;

    switch (nivel) {
      case 1: return this.demandaData.distribucionPorNivel.nivel1 || 0;
      case 2: return this.demandaData.distribucionPorNivel.nivel2 || 0;
      case 3: return this.demandaData.distribucionPorNivel.nivel3 || 0;
      case 4: return this.demandaData.distribucionPorNivel.nivel4 || 0;
      case 5: return this.demandaData.distribucionPorNivel.nivel5 || 0;
      default: return 0;
    }
  }

  getNivelColor(nivel: number): string {
    const colores: { [key: number]: string } = {
      1: '#FF0000',
      2: '#FF6600',
      3: '#FFCC00',
      4: '#00CC00',
      5: '#0066CC'
    };
    return colores[nivel] || '#6c757d';
  }

  getEstadoColor(estado: string): string {
    if (!estado) return 'secondary';
    if (estado.includes('Normal')) return 'success';
    if (estado.includes('Moderada')) return 'warning';
    if (estado.includes('Alta')) return 'danger';
    if (estado.includes('Crítica')) return 'danger';
    return 'info';
  }
}

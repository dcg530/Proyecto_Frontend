// src/app/core/services/reporte.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemandaDiariaResponse, EficienciaTriajeResponse, SaturacionServicioResponse, TiemposAtencionResponse } from '../../shared/models/reportes.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/Reportes`;

  constructor(private http: HttpClient) { }

  getDemandaDiaria(fecha?: Date): Observable<DemandaDiariaResponse> {
    const params = fecha ? `?fecha=${fecha.toISOString().split('T')[0]}` : '';
    return this.http.get<DemandaDiariaResponse>(`${this.apiUrl}/demanda-diaria${params}`);
  }

  getSaturacionServicio(fechaInicio: Date, fechaFin: Date): Observable<SaturacionServicioResponse> {
    const params = `?fechaInicio=${fechaInicio.toISOString().split('T')[0]}&fechaFin=${fechaFin.toISOString().split('T')[0]}`;
    return this.http.get<SaturacionServicioResponse>(`${this.apiUrl}/saturacion-servicio${params}`);
  }

  getTiemposAtencion(fechaInicio: Date, fechaFin: Date): Observable<TiemposAtencionResponse> {
    const params = `?fechaInicio=${fechaInicio.toISOString().split('T')[0]}&fechaFin=${fechaFin.toISOString().split('T')[0]}`;
    return this.http.get<TiemposAtencionResponse>(`${this.apiUrl}/tiempos-atencion${params}`);
  }

  getEficienciaTriaje(fechaInicio: Date, fechaFin: Date): Observable<EficienciaTriajeResponse> {
    const params = `?fechaInicio=${fechaInicio.toISOString().split('T')[0]}&fechaFin=${fechaFin.toISOString().split('T')[0]}`;
    return this.http.get<EficienciaTriajeResponse>(`${this.apiUrl}/eficiencia-triaje${params}`);
  }

  exportarCSV(fechaInicio: Date, fechaFin: Date): Observable<Blob> {
    const params = `?fechaInicio=${fechaInicio.toISOString().split('T')[0]}&fechaFin=${fechaFin.toISOString().split('T')[0]}`;
    return this.http.get(`${this.apiUrl}/exportar-csv${params}`, { responseType: 'blob' });
  }
}
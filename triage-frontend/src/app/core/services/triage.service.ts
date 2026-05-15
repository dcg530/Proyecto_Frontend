import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IniciarTriageRequest,
  SintomasRequest,
  ClasificacionResponse,
  ColaResponse
} from '../../shared/models/triage.model';

@Injectable({ providedIn: 'root' })
export class TriageService {
  private readonly apiUrl = `${environment.apiUrl}/Triage`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Inicia un nuevo proceso de triage
   */
  iniciarTriage(request: IniciarTriageRequest): Observable<{ triageId: number; mensaje: string }> {
    return this.http.post<{ triageId: number; mensaje: string }>(
      `${this.apiUrl}/iniciar`,
      request
    );
  }

  /**
   * Registra síntomas y signos vitales para clasificación
   */
  registrarSintomas(triageId: number, sintomas: SintomasRequest): Observable<ClasificacionResponse> {
    return this.http.post<ClasificacionResponse>(
      `${this.apiUrl}/${triageId}/sintomas`,
      sintomas
    );
  }

  /**
   * Obtiene el estado actual de la cola de espera
   */
  obtenerColaEspera(): Observable<ColaResponse> {
    return this.http.get<ColaResponse>(`${this.apiUrl}/cola`);
  }

  /**
   * Obtiene detalle de cola priorizada
   */
  obtenerDetalleCola(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cola/detalle`);
  }

  /**
   * Obtiene un triage por ID
   */
  obtenerTriage(triageId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${triageId}`);
  }

  /**
   * Obtiene el número de turno
   */
  obtenerTurno(triageId: number): Observable<{ numeroTurno: string; triageId: number }> {
    return this.http.get<{ numeroTurno: string; triageId: number }>(
      `${this.apiUrl}/turno/${triageId}`
    );
  }

  /**
 * Valida un triage por parte de enfermería
 */
  validarTriage(triageId: number, request: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${triageId}/validar-enfermeria`, request);
  }
}

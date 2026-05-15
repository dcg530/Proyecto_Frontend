import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NuevoPacienteRequest, SintomasKioscoRequest, ClasificacionKioscoResponse } from '../../shared/models/kiosco.model';

@Injectable({ providedIn: 'root' })
export class KioscoService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private readonly http: HttpClient) { }

  // Verificar si paciente existe y obtener sus datos
  verificarPaciente(identificacion: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Paciente/identificacion/${identificacion}`);
  }

  // Crear nuevo paciente
  crearPaciente(request: NuevoPacienteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Paciente`, request);
  }

  // Iniciar proceso de triage
  iniciarTriage(identificacion: string, eps: string): Observable<{ triageId: number }> {
    return this.http.post<{ triageId: number }>(`${this.apiUrl}/Triage/iniciar`, { identificacion, eps });
  }

  // Registrar síntomas y obtener clasificación
  registrarSintomas(triageId: number, sintomas: SintomasKioscoRequest): Observable<ClasificacionKioscoResponse> {
    return this.http.post<ClasificacionKioscoResponse>(`${this.apiUrl}/Triage/${triageId}/sintomas`, sintomas);
  }
}

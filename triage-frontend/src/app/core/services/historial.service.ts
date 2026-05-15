
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HistorialClinicoRequest, HistorialClinicoResponse, ActualizarHistorialRequest } from '../../shared/models/historial.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly apiUrl = `${environment.apiUrl}/HistorialClinico`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  private checkAdmin(): void {
    if (!this.authService.hasRole('Administrador')) {
      throw new Error('Acceso denegado. Se requieren permisos de administrador.');
    }
  }

  // Obtener todos los historiales
  getAll(): Observable<HistorialClinicoResponse[]> {
    return this.http.get<HistorialClinicoResponse[]>(this.apiUrl);
  }

  // Obtener historial por ID
  getById(id: number): Observable<HistorialClinicoResponse> {
    return this.http.get<HistorialClinicoResponse>(`${this.apiUrl}/${id}`);
  }

  // Obtener historial por paciente
  getByPacienteId(pacienteId: number): Observable<HistorialClinicoResponse[]> {
    return this.http.get<HistorialClinicoResponse[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  // Crear nuevo historial (solo admin)
  create(request: HistorialClinicoRequest): Observable<HistorialClinicoResponse> {
    this.checkAdmin();
    return this.http.post<HistorialClinicoResponse>(this.apiUrl, request);
  }

  // Actualizar historial (solo admin)
  update(id: number, request: ActualizarHistorialRequest): Observable<HistorialClinicoResponse> {
    this.checkAdmin();
    return this.http.put<HistorialClinicoResponse>(`${this.apiUrl}/${id}`, request);
  }

  // Eliminar historial (solo admin)
  delete(id: number): Observable<any> {
    this.checkAdmin();
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

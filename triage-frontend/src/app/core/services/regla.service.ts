import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Regla, TestReglasRequest, TestReglasResponse } from '../../shared/models/regla.model';



@Injectable({ providedIn: 'root' })
export class ReglaService {
  private readonly apiUrl = `${environment.apiUrl}/Reglas`;

  constructor(private readonly http: HttpClient) { }

  // Obtener todas las reglas
  getReglas(soloActivas?: boolean): Observable<Regla[]> {
    const params = soloActivas !== undefined ? `?soloActivas=${soloActivas}` : '';
    return this.http.get<Regla[]>(`${this.apiUrl}/ObtenerReglas${params}`);
  }

  // Obtener regla por ID
  getReglaById(id: number): Observable<Regla> {
    return this.http.get<Regla>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva regla
  crearRegla(regla: Regla): Observable<Regla> {
    return this.http.post<Regla>(`${this.apiUrl}/CrearNuevaRegla`, regla);
  }

  // Actualizar regla
  actualizarRegla(id: number, regla: Regla): Observable<any> {
    return this.http.put(`${this.apiUrl}/ActualizarRegla/${id}`, regla);
  }

  // Eliminar regla
  eliminarRegla(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/EliminarRegla/${id}`);
  }

  // Toggle activo/inactivo
  toggleRegla(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle`, {});
  }

  // Probar reglas
  probarReglas(request: TestReglasRequest): Observable<TestReglasResponse> {
    console.log(' Enviando prueba de reglas:', request);

    // Filtrar propiedades undefined
    const body = Object.fromEntries(
      Object.entries(request).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );

    console.log(' Body a enviar:', body);
    console.log(' URL:', `${this.apiUrl}/test`);

    // Configurar headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'text/plain'
    });

    // GET con body (no estándar pero necesario para este backend)
    return this.http.request<TestReglasResponse>('POST', `${this.apiUrl}/test`, {
      headers,
      body: body
    });
  }
}

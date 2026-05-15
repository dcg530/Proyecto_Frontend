import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CargaMasivaRequest, CargaMasivaResponse, CrearPacienteRequest, Paciente } from '../../shared/models/paciente.model';
import { AuthService } from './auth.service';



@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly apiUrl = `${environment.apiUrl}/Paciente`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }

  // Verificar si es admin antes de operaciones de escritura
  private checkAdmin(): void {
    const isAdmin = this.authService.hasRole('Administrador');
    console.log(`🔐 Verificando permisos de administrador: ${isAdmin ? '✅ Autorizado' : '❌ Denegado'}`);

    if (!isAdmin) {
      console.error('🚫 Acceso denegado: Se requieren permisos de administrador');
      throw new Error('Acceso denegado. Se requieren permisos de administrador.');
    }
  }

  // Operaciones solo para admin
  // Crear paciente (solo admin)
  crearPaciente(request: CrearPacienteRequest): Observable<any> {
    console.log(`🛡️ [PacienteService] Verificando permisos para crear paciente...`);
    this.checkAdmin();

    console.log(`📝 [PacienteService] Creando nuevo paciente:`, {
      identificacion: request.identificacion,
      nombres: request.nombres,
      apellidos: request.apellidos,
      eps: request.eps,
      telefono: request.telefono,
      correo: request.correo
    });
    console.log(`📍 [PacienteService] URL: ${this.apiUrl}`);

    return this.http.post(this.apiUrl, request).pipe(
      tap({
        next: (response) => {
          console.log(`✅ [PacienteService] Paciente creado exitosamente:`, response);
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error al crear paciente:`, {
            status: error.status,
            message: error.message,
            error: error.error,
            requestData: request
          });
        }
      })
    );
  }

  // Actualizar paciente (solo admin)
  actualizarPaciente(id: number, request: any): Observable<any> {
    console.log(`🛡️ [PacienteService] Verificando permisos para actualizar paciente...`);
    this.checkAdmin();

    console.log(`✏️ [PacienteService] Actualizando paciente ID ${id}:`, {
      nombres: request.nombres,
      apellidos: request.apellidos,
      telefono: request.telefono,
      eps: request.eps
    });
    console.log(`📍 [PacienteService] URL: ${this.apiUrl}/${id}`);

    return this.http.put(`${this.apiUrl}/${id}`, request).pipe(
      tap({
        next: (response) => {
          console.log(`✅ [PacienteService] Paciente ID ${id} actualizado exitosamente:`, response);
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error al actualizar paciente ${id}:`, {
            status: error.status,
            message: error.message,
            error: error.error,
            requestData: request
          });
        }
      })
    );
  }

  // Carga masiva (solo admin)
  cargaMasiva(request: CargaMasivaRequest): Observable<CargaMasivaResponse> {
    console.log(`🛡️ [PacienteService] Verificando permisos para carga masiva...`);
    this.checkAdmin();

    const totalPacientes = request.pacientes?.length || 0;
    console.log(`📦 [PacienteService] Iniciando carga masiva de ${totalPacientes} pacientes`);
    console.log(`📋 [PacienteService] Primeros 3 pacientes a cargar:`, request.pacientes?.slice(0, 3));
    console.log(`📍 [PacienteService] URL: ${this.apiUrl}/masivo`);

    return this.http.post<CargaMasivaResponse>(`${this.apiUrl}/masivo`, request).pipe(
      tap({
        next: (response) => {
          console.log(`✅ [PacienteService] Carga masiva completada:`, {
            totalProcesados: response.totalProcesados,
            exitosos: response.exitosos,
            fallidos: response.fallidos
          });

          if (response.fallidos > 0) {
            console.warn(`⚠️ [PacienteService] Fallos en carga masiva:`, response.resultados?.filter(r => !r.exitoso));
          }
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error en carga masiva:`, {
            status: error.status,
            message: error.message,
            error: error.error
          });
        }
      })
    );
  }

  // Obtener todos los pacientes
  getPacientes(): Observable<Paciente[]> {
    console.log(`[PacienteService] Solicitando lista de todos los pacientes - URL: ${this.apiUrl}/ListaPacientes`);

    return this.http.get<Paciente[]>(`${this.apiUrl}/ListaPacientes`).pipe(
      tap({
        next: (data) => {
          console.log(`[PacienteService] Pacientes obtenidos exitosamente. Total: ${data?.length || 0} pacientes`);
          console.log(`[PacienteService] Primeros 3 pacientes:`, data?.slice(0, 3));
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error al obtener pacientes:`, {
            status: error.status,
            message: error.message,
            url: `${this.apiUrl}/ListaPacientes`
          });
        }
      })
    );
  }

  // Obtener paciente por ID
  getPacienteById(id: number): Observable<Paciente> {
    console.log(`🔍 [PacienteService] Buscando paciente por ID: ${id} - URL: ${this.apiUrl}/${id}`);

    return this.http.get<Paciente>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: (data) => {
          console.log(`✅ [PacienteService] Paciente encontrado:`, {
            id: data?.id,
            identificacion: data?.identificacion,
            nombres: data?.nombres,
            apellidos: data?.apellidos,
            eps: data?.eps,
            telefono: data?.telefono,
            correo: data?.correo,
            genero: data?.genero,
            fechaNacimiento: data?.fechaNacimiento,
            direccion: data?.direccion
          });
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error al buscar paciente ID ${id}:`, {
            status: error.status,
            message: error.message,
            error: error.error
          });
        }
      })
    );
  }

  // Buscar paciente por identificación
  getPacienteByIdentificacion(identificacion: string): Observable<any> {
    console.log(`🔍 [PacienteService] Buscando paciente por identificación: ${identificacion} - URL: ${this.apiUrl}/identificacion/${identificacion}`);

    return this.http.get(`${this.apiUrl}/identificacion/${identificacion}`).pipe(
      tap({
        next: (data) => {
          console.log(`✅ [PacienteService] Paciente encontrado por identificación "${identificacion}":`, data);
        },
        error: (error) => {
          console.error(`❌ [PacienteService] Error al buscar por identificación ${identificacion}:`, {
            status: error.status,
            message: error.message
          });
        }
      })
    );
  }

  // Obtener historial clínico
  getHistorialPaciente(id: number): Observable<any> {
    console.log(`[PacienteService] Solicitando historial clínico del paciente ID: ${id} - URL: ${this.apiUrl}/${id}/historial`);

    return this.http.get(`${this.apiUrl}/${id}/historial`).pipe(
      tap({
        next: (data) => {
          console.log(` [PacienteService] Historial obtenido para paciente ID ${id}:`, data);
        },
        error: (error) => {
          console.error(` [PacienteService] Error al obtener historial del paciente ${id}:`, {
            status: error.status,
            message: error.message
          });
        }
      })
    );
  }
}

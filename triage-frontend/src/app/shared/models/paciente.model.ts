export interface Paciente {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  eps: string;
  telefono: string;
  correo: string;
  direccion: string;
  genero: string;
  fechaRegistro: Date;
  activo: boolean;
}

export interface CrearPacienteRequest {
  identificacion: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  eps: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  genero?: string;
}

export interface CargaMasivaRequest {
  pacientes: CrearPacienteRequest[];
}

export interface CargaMasivaResponse {
  totalProcesados: number;
  exitosos: number;
  fallidos: number;
  resultados: CargaMasivaResultado[];
}

export interface CargaMasivaResultado {
  identificacion: string;
  exitoso: boolean;
  mensaje: string;
  id?: number;
}

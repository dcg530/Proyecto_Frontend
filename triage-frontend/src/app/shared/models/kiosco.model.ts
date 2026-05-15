export interface NuevoPacienteRequest {
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

export interface SintomasKioscoRequest {
  descripcion: string;
  frecuenciaCardiaca?: number;
  presionArterialSistolica?: number;
  presionArterialDiastolica?: number;
  temperatura?: number;
  saturacionOxigeno?: number;
  frecuenciaRespiratoria?: number;
  dolorEscala?: string;
  antecedentes?: string[];
  alergias?: string[];
}

export interface ClasificacionKioscoResponse {
  nivelTriage: number;
  recomendacion: string;
  tiempoEstimadoEspera: number;
  numeroTurno: string;
  mensajeAdicional: string;
  requiereValidacionEnfermeria: boolean;
}

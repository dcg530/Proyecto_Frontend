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

export interface IniciarTriageRequest {
  identificacion: string;
  eps: string;
}

export interface SintomasRequest {
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

export interface ClasificacionResponse {
  nivelTriage: number;
  recomendacion: string;
  tiempoEstimadoEspera: number;
  requiereValidacionEnfermeria: boolean;
  numeroTurno: string;
  mensajeAdicional: string;
}

export interface PacienteEnCola {
  id: number;
  pacienteNombre: string;
  nivelTriage: number;
  tiempoEspera: number;
  estado: string;
}

export interface ColaResponse {
  pacientesEnCola: PacienteEnCola[];
  estadisticas: {
    totalEnEspera: number;
    porNivel: {
      nivel1: number;
      nivel2: number;
      nivel3: number;
      nivel4: number;
      nivel5: number;
    };
    tiempoPromedioEspera: number;
  };
  ultimaActualizacion: Date;
}

export const NivelesTriage = [
  { nivel: 1, nombre: 'Crítico - Reanimación', color: '#FF0000', tiempoMax: 0, icon: '🚨' },
  { nivel: 2, nombre: 'Emergencia', color: '#FF6600', tiempoMax: 10, icon: '⚠️' },
  { nivel: 3, nombre: 'Urgencia', color: '#FFCC00', tiempoMax: 60, icon: '🟡' },
  { nivel: 4, nombre: 'Menos Urgente', color: '#00CC00', tiempoMax: 180, icon: '🟢' },
  { nivel: 5, nombre: 'No Urgente', color: '#0066CC', tiempoMax: 240, icon: '🔵' }
];

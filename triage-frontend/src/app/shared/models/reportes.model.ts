
export interface DemandaDiariaResponse {
  fecha: string;
  totalPacientes: number;
  distribucionPorHora: { hora: number; cantidad: number }[];
  distribucionPorNivel: {
    nivel1: number;
    nivel2: number;
    nivel3: number;
    nivel4: number;
    nivel5: number;
  };
  horasPico: { hora: number; cantidad: number }[];
}

export interface SaturacionServicioResponse {
  fechaInicio: string;
  fechaFin: string;
  totalPacientes: number;
  capacidadTotal: number;
  porcentajeSaturacion: number;
  saturacionPorDia: { fecha: string; cantidad: number; porcentaje: number }[];
  estado: string;
}

export interface TiemposAtencionResponse {
  fechaInicio: string;
  fechaFin: string;
  resumenGeneral: {
    tiempoPromedioGeneral: number;
    tiempoMinimoGeneral: number;
    tiempoMaximoGeneral: number;
  };
  porNivel: {
    nivel: number;
    descripcion: string;
    cantidad: number;
    tiempoPromedio: number;
    tiempoMinimo: number;
    tiempoMaximo: number;
    cumpleEstándar: boolean;
  }[];
}

export interface EficienciaTriajeResponse {
  fechaInicio: string;
  fechaFin: string;
  metricas: {
    porcentajeValidadoEnfermeria: number;
    porcentajeAutomatizado: number;
    precisionSistema: number;
    tasaReclasificacion: number;
  };
  recomendaciones: string[];
}
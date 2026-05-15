export interface Regla {
  id: number;
  nombreRegla: string;
  condicion: string;
  nivelTriageAsignado: number;
  activo: boolean;
  descripcion: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

export interface TestReglasRequest {
  saturacionOxigeno?: number;
  temperatura?: number;
  dolorEscala?: string;
  frecuenciaCardiaca?: number;
}

export interface TestReglasResultado {
  reglaId: number;
  nombre: string;
  nivelAsignado: number;
  cumple: boolean;
  descripcion: string;
}

export interface TestReglasResponse {
  resultados: TestReglasResultado[];
  nivelRecomendado: number;
  mensaje: string;
}

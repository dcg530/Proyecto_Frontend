// src/app/shared/models/historial.model.ts
export interface HistorialClinicoRequest {
  pacienteId: number;
  diagnostico: string;
  medicamentos: string;
  alergias: string;
  antecedentes: string;
}

export interface HistorialClinicoResponse {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  diagnostico: string;
  medicamentos: string;
  alergias: string;
  antecedentes: string;
  fechaRegistro: Date;
  fechaRegistroFormateada: string;
}

export interface ActualizarHistorialRequest {
  diagnostico: string;
  medicamentos: string;
  alergias: string;
  antecedentes: string;
}

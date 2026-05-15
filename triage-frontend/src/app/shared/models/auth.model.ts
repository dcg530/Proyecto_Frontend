export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  rol: string;
  usuario: string;
  expiraEn: Date;
}

export interface User {
  username: string;
  rol: string;
  token: string;
  expiraEn: Date;
}

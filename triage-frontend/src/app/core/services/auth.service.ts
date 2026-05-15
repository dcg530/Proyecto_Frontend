import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Obtiene el usuario actual
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtiene el token actual
   */
  public getToken(): string | null {
    const user = this.getUserFromStorage();
    return user?.token || null;
  }

  /**
   * Verifica si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    const user = this.getUserFromStorage();
    if (!user || !user.token) return false;

    // Verificar si el token ha expirado
    const expiraEn = new Date(user.expiraEn);
    return expiraEn > new Date();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  public hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.rol === role;
  }

  /**
   * Login del usuario
   */
  login(request: LoginRequest): Observable<LoginResponse> {
    console.log('📤 Enviando petición de login al backend:', request);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response && response.token) {
            const user: User = {
              username: response.usuario,
              rol: response.rol,
              token: response.token,
              expiraEn: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 horas
            };

            // Guardar en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('💾 Usuario guardado en localStorage:', user);

            // Actualizar BehaviorSubject
            this.currentUserSubject.next(user);

            // Verificar que se guardó correctamente
            const stored = localStorage.getItem('currentUser');

          } else {
            console.error('Respuesta sin token:', response);
          }
        })
      );
  }
  private redirectByRole(rol: string): void {
    console.log('Redirigiendo según rol:', rol);

    if (rol === 'Enfermero') {
      this.router.navigate(['/enfermeria/validacion']);
    } else if (rol === 'Administrador') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/triage/inicio']);
    }
  }

  /**
   * Logout del usuario
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    this.toastr.info('Sesión cerrada correctamente');
  }

  /**
   * Obtiene el usuario del localStorage
   */
  private getUserFromStorage(): User | null {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.expiraEn) {
        user.expiraEn = new Date(user.expiraEn);
      }
      return user;
    }
    return null;
  }
}

// src/app/core/guards/enfermero.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EnfermeroGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(): boolean {
    if (this.authService.hasRole('Kiosco')) {
      this.toastr.error('Acceso denegado. El usuario Kiosco no tiene permisos de administrador.');
      this.router.navigate(['/kiosco']);
      return false;
    }
    
    if (this.authService.isAuthenticated() && this.authService.hasRole('Enfermero')) {
      return true;
    }

    this.toastr.error('Acceso denegado. Se requieren permisos de enfermero.');
    this.router.navigate(['/triage/inicio']);
    return false;
  }
}

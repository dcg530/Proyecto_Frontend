// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const rol = this.authService.currentUserValue?.rol;

      // Si es kiosco, redirigir al kiosco
      if (rol === 'Kiosco') {
        this.router.navigate(['/kiosco']);
        return false;
      }

      return true;
    }

    this.toastr.warning('Debe iniciar sesión para acceder a esta página');
    this.router.navigate(['/login']);
    return false;
  }
}

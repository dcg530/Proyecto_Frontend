// src/app/features/auth/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.warning('Complete todos los campos');
      return;
    }

    this.isLoading = true;

    console.log('Enviando login:', this.loginForm.value);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        console.log('Rol del usuario:', response.rol);

        this.isLoading = false;
        this.toastr.success(`Bienvenido ${response.usuario}`, 'Login exitoso');

        // Redirección según el rol
        this.redirigirPorRol(response.rol);
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.isLoading = false;
        this.toastr.error(error.error?.mensaje || 'Credenciales incorrectas');
      }
    });
  }

  private redirigirPorRol(rol: string): void {
    console.log('🔄 Redirigiendo según rol:', rol);

    switch (rol) {
      case 'Administrador':
        console.log('👨‍💼 Redirigiendo a Dashboard de administrador');
        this.router.navigate(['/admin/dashboard']).then(success => {
          console.log('Redirección a /admin/dashboard:', success ? '✅ exitosa' : '❌ fallida');
          if (!success) {
            this.router.navigate(['/pacientes']);
          }
        });
        break;
      case 'Enfermero':
        console.log('👩‍⚕️ Redirigiendo a validación de enfermería');
        this.router.navigate(['/enfermeria/validacion']).then(success => {
          console.log('Redirección a /enfermeria/validacion:', success ? '✅ exitosa' : '❌ fallida');
        });
        break;
      case 'Kiosco':
        console.log('🖥️ Redirigiendo al Kiosco interactivo');
        this.router.navigate(['/kiosco']).then(success => {
          console.log('Redirección a /kiosco:', success ? '✅ exitosa' : '❌ fallida');
        });
        break;
      default:
        console.log('🏥 Redirigiendo a inicio de triage');
        this.router.navigate(['/triage/inicio']).then(success => {
          console.log('Redirección a /triage/inicio:', success ? '✅ exitosa' : '❌ fallida');
        });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillEnfermero(): void {
    this.loginForm.patchValue({
      username: 'enfermero',
      password: '123456'
    });
  }

  fillAdmin(): void {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'admin123'
    });
  }

  fillKiosco(): void {
    this.loginForm.patchValue({
      username: 'kiosco',
      password: 'Kiosco123'
    });
  }
}

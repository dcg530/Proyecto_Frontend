// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone  : false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentUser: any = null;
  currentRoute: string = '';

  menuItems: MenuItem[] = [
    { icon: 'bi bi-speedometer2', label: 'Dashboard', route: '/admin/dashboard', roles: ['Administrador'] },
    { icon: 'bi bi-people', label: 'Gestión de Pacientes', route: '/pacientes', roles: ['Administrador'] },
    { icon: 'bi-folder-check', label: 'Historial Clínico', route: '/admin/historial', roles: ['Administrador'] },
    { icon: 'bi bi-plus-circle', label: 'Nuevo Triage', route: '/triage/inicio', roles: ['Enfermero', 'Administrador'] },
    { icon: 'bi bi-clock-history', label: 'Sala de Espera', route: '/triage/sala-espera', roles: ['Enfermero', 'Administrador'] },
    { icon: 'bi bi-shield-check', label: 'Validar Pacientes', route: '/enfermeria/validacion', roles: ['Enfermero'] },
    { icon: 'bi bi-graph-up', label: 'Reportes', route: '/admin/reportes', roles: ['Administrador'] },
    { icon: 'bi bi-gear', label: 'Configuración Reglas ', route: '/admin/reglas', roles: ['Administrador'] },
  ];

  filteredMenuItems: MenuItem[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,

  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.loadUser();
    this.filterMenuByRole();
  }

  loadUser(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.filterMenuByRole();
    });
  }

  filterMenuByRole(): void {
    if (!this.currentUser) {
      this.filteredMenuItems = [];
      return;
    }

    if (this.currentUser.rol === 'Kiosco') {
      this.filteredMenuItems = [];
      return;
    }

    this.filteredMenuItems = this.menuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(this.currentUser.rol);
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    return this.currentUser?.username || 'Usuario';
  }

  getUserRole(): string {
    const role = this.currentUser?.rol || '';
    return role === 'Enfermero' ? '👩‍⚕️ Enfermero' : '👨‍💼 Administrador';
  }

  getUserInitial(): string {
    const name = this.getUserName();
    return name.charAt(0).toUpperCase();
  }
}

// src/app/shared/layouts/main-layout/main-layout.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  template: `
    <app-sidebar></app-sidebar>
    <div class="main-content" id="mainContent">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-content {
      margin-left: 280px;
      transition: all 0.3s ease;
      min-height: 100vh;
      background: #f8f9fa;
    }
  `]
})
export class MainLayoutComponent { }

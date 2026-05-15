import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resultado-kiosco',
  standalone: false,
  templateUrl: './resultado-kiosco.component.html',
  styleUrls: ['./resultado-kiosco.component.css']
})

export class ResultadoKioscoComponent implements OnInit {
  clasificacion: any = null;
  nivelInfo: any = null;
  fechaActual: string = '';

  nivelesTriage = [
    { nivel: 1, nombre: 'Crítico - Reanimación', color: '#FF0000', icon: '🚨' },
    { nivel: 2, nombre: 'Emergencia', color: '#FF6600', icon: '⚠️' },
    { nivel: 3, nombre: 'Urgencia', color: '#FFCC00', icon: '🟡' },
    { nivel: 4, nombre: 'Menos Urgente', color: '#00CC00', icon: '🟢' },
    { nivel: 5, nombre: 'No Urgente', color: '#0066CC', icon: '🔵' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fechaActual = new Date().toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const saved = localStorage.getItem('clasificacion');
    if (saved) {
      this.clasificacion = JSON.parse(saved);
      this.nivelInfo = this.nivelesTriage.find(n => n.nivel === this.clasificacion.nivelTriage);
    } else {
      this.toastr.error('No se encontró la clasificación');
      this.router.navigate(['/kiosco']);
    }
  }

  getColorNivel(nivel: number): string {
    const info = this.nivelesTriage.find(n => n.nivel === nivel);
    return info?.color || '#6c757d';
  }

  getNombreNivel(nivel: number): string {
    const info = this.nivelesTriage.find(n => n.nivel === nivel);
    return info?.nombre || 'Nivel desconocido';
  }

  imprimirTurno(): void {
    const contenido = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Turno - Triage Inteligente</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            margin: 0;
          }
          .turno-card {
            border: 2px solid #0056b3;
            border-radius: 20px;
            padding: 30px;
            max-width: 400px;
            margin: 0 auto;
          }
          .hospital {
            color: #0056b3;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .turno-label {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .turno-number {
            font-size: 48px;
            font-weight: bold;
            margin: 20px 0;
            color: #333;
          }
          .nivel {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            margin: 10px 0;
          }
          .fecha {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="turno-card">
          <div class="hospital">🏥 Sistema de Triage Inteligente</div>
          <div class="hospital">Sanitas - Centro Industrial</div>
          <div class="turno-label">Su número de turno</div>
          <div class="turno-number">${this.clasificacion?.numeroTurno}</div>
          <div class="nivel" style="background-color: ${this.getColorNivel(this.clasificacion?.nivelTriage)}">
            Nivel ${this.clasificacion?.nivelTriage}
          </div>
          <div class="fecha">${new Date().toLocaleString()}</div>
        </div>
      </body>
      </html>
    `;

    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenido);
      ventana.document.close();
      ventana.print();
    }
  }

  nuevoPaciente(): void {
    localStorage.removeItem('triageId');
    localStorage.removeItem('clasificacion');
    localStorage.removeItem('pacienteIdentificacion');
    this.router.navigate(['/kiosco']);
  }
}

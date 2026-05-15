import { Component, OnInit } from '@angular/core';
import { SignalRService } from './core/services/signalr.service';



@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Triage Inteligente';

  constructor(private readonly signalR: SignalRService) { }

  ngOnInit(): void {
    // Iniciar conexión SignalR para notificaciones en tiempo real
    this.signalR.startConnection();
  }
}

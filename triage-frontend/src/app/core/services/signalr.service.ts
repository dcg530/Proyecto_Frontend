// src/app/core/services/signalr.service.ts
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: HubConnection;
  private isConnected = false;

  private readonly nuevoPacienteSubject = new Subject<any>();
  private readonly colaActualizadaSubject = new Subject<any>();
  private readonly triageValidadoSubject = new Subject<any>();

  public nuevoPaciente$ = this.nuevoPacienteSubject.asObservable();
  public colaActualizada$ = this.colaActualizadaSubject.asObservable();
  public triageValidado$ = this.triageValidadoSubject.asObservable();

  constructor(private readonly toastr: ToastrService) { }

  startConnection(): void {
    if (this.isConnected) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ SignalR conectado');
        this.isConnected = true;
        this.registerEvents();
      })
      .catch(err => {
        console.error('❌ Error en SignalR:', err);
        this.toastr.warning('Conectando en modo offline. Las actualizaciones en tiempo real no estarán disponibles.');
      });
  }

  private registerEvents(): void {
    this.hubConnection.on('NuevoPacienteRegistrado', (data) => {
      console.log('📢 Nuevo paciente registrado:', data);
      this.nuevoPacienteSubject.next(data);
      this.toastr.info(`Nuevo paciente registrado`, 'Actualización');
    });

    this.hubConnection.on('ColaActualizada', (data) => {
      console.log('📊 Cola actualizada:', data);
      this.colaActualizadaSubject.next(data);
    });

    this.hubConnection.on('TriageValidado', (data) => {
      console.log('✅ Triage validado:', data);
      this.triageValidadoSubject.next(data);
      this.toastr.success(`Paciente validado - Nivel ${data.nivelValidado}`, 'Validación');
    });
  }

  stopConnection(): void {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.stop();
      this.isConnected = false;
    }
  }
}

// src/app/features/configuracion/pages/reglas/reglas.component.ts
import { Component, OnInit } from '@angular/core';
import { ReglaService } from '../../../../core/services/regla.service';
import { ToastrService } from 'ngx-toastr';
import { Regla, TestReglasResponse, TestReglasResultado } from '../../../../shared/models/regla.model';

@Component({
  selector: 'app-reglas',
  standalone: false,
  templateUrl: './reglas.component.html',
  styleUrls: ['./reglas.component.css']
})
export class ReglasComponent implements OnInit {
  reglas: Regla[] = [];
  reglasFiltradas: Regla[] = [];
  isLoading = false;
  showModal = false;
  showTestModal = false;
  isEditMode = false;
  selectedReglaId: number | null = null;

  // Variables para el formulario
  nombreRegla = '';
  condicionRegla = '';
  nivelSeleccionado = 0;
  descripcionRegla = '';

  // Variables para prueba
  testSaturacion: number | null = null;
  testTemperatura: number | null = null;
  testDolor: number | null = null;
  testFrecuencia: number | null = null;
  testResultados: TestReglasResultado[] = [];
  testNivelRecomendado: number | null = null;
  testMensaje: string | null = null;

  nivelesTriage = [
    { value: 1, label: 'Nivel 1 - Reanimación', color: '#FF0000' },
    { value: 2, label: 'Nivel 2 - Emergencia', color: '#FF6600' },
    { value: 3, label: 'Nivel 3 - Urgencia', color: '#FFCC00' },
    { value: 4, label: 'Nivel 4 - Menos urgente', color: '#00CC00' },
    { value: 5, label: 'Nivel 5 - No urgente', color: '#0066CC' }
  ];

  constructor(
    private readonly reglaService: ReglaService,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarReglas();
  }

  cargarReglas(): void {
    this.isLoading = true;
    this.reglaService.getReglas().subscribe({
      next: (data) => {
        this.reglas = data;
        this.reglasFiltradas = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cargar las reglas');
        this.isLoading = false;
      }
    });
  }

  filtrarReglas(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.reglasFiltradas = this.reglas.filter(regla =>
      regla.nombreRegla.toLowerCase().includes(searchTerm) ||
      regla.descripcion.toLowerCase().includes(searchTerm)
    );
  }

  filtrarPorEstado(event: any): void {
    const estado = event.target.value;
    if (estado === 'todos') {
      this.reglasFiltradas = this.reglas;
    } else if (estado === 'activos') {
      this.reglasFiltradas = this.reglas.filter(r => r.activo);
    } else {
      this.reglasFiltradas = this.reglas.filter(r => !r.activo);
    }
  }

  abrirModalNuevo(): void {
    this.isEditMode = false;
    this.selectedReglaId = null;
    this.nombreRegla = '';
    this.condicionRegla = '';
    this.nivelSeleccionado = 0;
    this.descripcionRegla = '';
    this.showModal = true;
  }

  editarRegla(regla: Regla): void {
    this.isEditMode = true;
    this.selectedReglaId = regla.id;
    this.nombreRegla = regla.nombreRegla;
    this.condicionRegla = regla.condicion;
    this.nivelSeleccionado = regla.nivelTriageAsignado;
    this.descripcionRegla = regla.descripcion;
    this.showModal = true;
  }

  guardarRegla(): void {
    if (!this.nombreRegla || !this.condicionRegla || !this.nivelSeleccionado || !this.descripcionRegla) {
      this.toastr.warning('Complete todos los campos');
      return;
    }

    const reglaData: Regla = {
      id: 0,
      nombreRegla: this.nombreRegla,
      condicion: this.condicionRegla,
      nivelTriageAsignado: this.nivelSeleccionado,
      activo: true,
      descripcion: this.descripcionRegla
    };

    this.isLoading = true;

    if (this.isEditMode && this.selectedReglaId) {
      reglaData.id = this.selectedReglaId;
      this.reglaService.actualizarRegla(this.selectedReglaId, reglaData).subscribe({
        next: () => {
          this.toastr.success('Regla actualizada correctamente');
          this.cargarReglas();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error al actualizar la regla');
          this.isLoading = false;
        }
      });
    } else {
      this.reglaService.crearRegla(reglaData).subscribe({
        next: () => {
          this.toastr.success('Regla creada correctamente');
          this.cargarReglas();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error al crear la regla');
          this.isLoading = false;
        }
      });
    }
  }

  eliminarRegla(id: number, nombre: string): void {
    if (confirm(`¿Eliminar la regla "${nombre}"?`)) {
      this.reglaService.eliminarRegla(id).subscribe({
        next: () => {
          this.toastr.success('Regla eliminada');
          this.cargarReglas();
        },
        error: (error) => {
          console.error(error);
          this.toastr.error('Error al eliminar');
        }
      });
    }
  }

  toggleRegla(id: number): void {
    this.reglaService.toggleRegla(id).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado');
        this.cargarReglas();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error al cambiar estado');
      }
    });
  }

  abrirTestModal(): void {
    this.testSaturacion = null;
    this.testTemperatura = null;
    this.testDolor = null;
    this.testFrecuencia = null;
    this.testResultados = [];
    this.showTestModal = true;
  }

  probarReglas(): void {
    // Construir request solo con valores válidos
    const request: any = {};

    if (this.testSaturacion !== null && this.testSaturacion !== undefined && this.testSaturacion > 0) {
      request.saturacionOxigeno = this.testSaturacion;
    }

    if (this.testTemperatura !== null && this.testTemperatura !== undefined && this.testTemperatura > 0) {
      request.temperatura = this.testTemperatura;
    }

    if (this.testDolor !== null && this.testDolor !== undefined && this.testDolor > 0) {
      request.dolorEscala = this.testDolor.toString();
    }

    if (this.testFrecuencia !== null && this.testFrecuencia !== undefined && this.testFrecuencia > 0) {
      request.frecuenciaCardiaca = this.testFrecuencia;
    }

    console.log(' Ejecutando prueba de reglas con datos:', request);

    if (Object.keys(request).length === 0) {
      this.toastr.warning('Ingrese al menos un valor para probar las reglas');
      return;
    }

    this.isLoading = true;

    this.reglaService.probarReglas(request).subscribe({
      next: (response: TestReglasResponse) => {
        console.log('Respuesta recibida:', response);

        this.testResultados = response.resultados || [];
        this.testNivelRecomendado = response.nivelRecomendado;
        this.testMensaje = response.mensaje;

        const activadas = response.resultados?.filter(r => r.cumple).length || 0;

        if (activadas > 0) {
          this.toastr.success(`${activadas} regla(s) activada(s)`, `Nivel ${response.nivelRecomendado}`);
          this.toastr.info(response.mensaje, 'Recomendación', { timeOut: 8000 });
        } else {
          this.toastr.info('No se activaron reglas con los valores ingresados');
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error en la petición:', error);

        // Mostrar mensaje de error detallado
        if (error.status === 0) {
          this.toastr.error('No se pudo conectar con el servidor. Verifique que el backend esté corriendo');
        } else if (error.status === 400) {
          this.toastr.error('Error en la solicitud. Verifique los datos ingresados');
        } else if (error.status === 401) {
          this.toastr.error('Sesión expirada. Por favor inicie sesión nuevamente');
        } else if (error.status === 500) {
          this.toastr.error('Error interno del servidor');
        } else {
          this.toastr.error(error.error?.mensaje || 'Error al probar las reglas');
        }

        this.isLoading = false;
      }
    });
  }



  getColorNivel(nivel: number): string {
    const nivelInfo = this.nivelesTriage.find(n => n.value === nivel);
    return nivelInfo?.color || '#6c757d';
  }

  cerrarModal(): void {
    this.showModal = false;
    this.showTestModal = false;
  }
  cargarEjemploCritico(): void {
    this.testSaturacion = 82;
    this.testTemperatura = null;
    this.testDolor = null;
    this.testFrecuencia = null;
    this.probarReglas();
  }

  cargarEjemploDolor(): void {
    this.testSaturacion = null;
    this.testTemperatura = null;
    this.testDolor = 8;
    this.testFrecuencia = null;
    this.probarReglas();
  }
}

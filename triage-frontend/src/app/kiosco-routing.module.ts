import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioKioscoComponent } from './features/kiosco/pages/inicio-kiosco/inicio-kiosco.component';
import { RegistroPacienteComponent } from './features/kiosco/pages/registro-paciente/registro-paciente.component';
import { ResultadoKioscoComponent } from './features/kiosco/pages/resultado-kiosco/resultado-kiosco.component';
import { SintomasKioscoComponent } from './features/kiosco/pages/sintomas-kiosco/sintomas-kiosco.component';


const routes: Routes = [
  { path: '', component: InicioKioscoComponent },
  { path: 'registro', component: RegistroPacienteComponent },
  { path: 'sintomas/:id', component: SintomasKioscoComponent },
  { path: 'resultado/:id', component: ResultadoKioscoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KioscoRoutingModule { }

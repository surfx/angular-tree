import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginainicialComponent } from './components/paginainicial/paginainicial.component';
import { PaginamodalComponent } from './components/paginamodal/paginamodal.component';
import { TestesComponent } from './components/testes/testes.component';

const routes: Routes = [
  { path: 'inicial', component: PaginainicialComponent },
  { path: 'modal', component: PaginamodalComponent },
  { path: 'testes', component: TestesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

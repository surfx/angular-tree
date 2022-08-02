import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginainicialComponent } from './components/paginainicial/paginainicial.component';
import { PaginamodalComponent } from './components/paginamodal/paginamodal.component';

const routes: Routes = [
  { path: 'inicial', component: PaginainicialComponent },
  { path: 'modal', component: PaginamodalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

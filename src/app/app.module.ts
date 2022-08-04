import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArvoreSimpleDataComponent } from './components/arvore-simple-data/arvore-simple-data.component';
import { PaginainicialComponent } from './components/paginainicial/paginainicial.component';
import { PaginamodalComponent } from './components/paginamodal/paginamodal.component';
import { TestesComponent } from './components/testes/testes.component';
import { ComponenteTesteComponent } from './components/testes/componente-teste/componente-teste.component';

@NgModule({
  declarations: [
    AppComponent,
    ArvoreSimpleDataComponent,
    PaginainicialComponent,
    PaginamodalComponent,
    TestesComponent,
    ComponenteTesteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

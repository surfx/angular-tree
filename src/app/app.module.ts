import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArvoreSimpleRecursiveComponent } from './components/tree/arvore-simple-recursive/arvore-simple-recursive.component';
import { PaginainicialComponent } from './components/paginainicial/paginainicial.component';
import { PaginamodalComponent } from './components/paginamodal/paginamodal.component';
import { TreeSimpleComponent } from './components/tree/tree-simple/tree-simple.component';
import { TestesComponent } from './components/testes/testes.component';

@NgModule({
  declarations: [
    AppComponent,
    ArvoreSimpleRecursiveComponent,
    PaginainicialComponent,
    PaginamodalComponent,
    TestesComponent,
    TreeSimpleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaginainicialComponent } from './components/paginainicial/paginainicial.component';
import { PaginamodalComponent } from './components/paginamodal/paginamodal.component';
import { TestesComponent } from './components/testes/testes.component';
import { ArvoreSimpleRecursiveComponent } from './components/tree/arvore-simple-recursive/arvore-simple-recursive.component';
import { TreeSimpleComponent } from './components/tree/tree-simple/tree-simple.component';

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
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

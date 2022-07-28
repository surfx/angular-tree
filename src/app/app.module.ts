import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArvoreSimpleDataComponent } from './components/arvore-simple-data/arvore-simple-data.component';

@NgModule({
  declarations: [
    AppComponent,
    ArvoreSimpleDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

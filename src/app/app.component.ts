import { Component, ViewChild } from '@angular/core';
import { ArvoreSimpleDataComponent } from './components/arvore-simple-data/arvore-simple-data.component';
import { DataTree } from './entidades/data-tree';
import { DadosArvoreService } from './servicos/dados-arvore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;

  data: DataTree[] | undefined;
  alldata: DataTree[] | undefined;

  constructor(private service: DadosArvoreService) {
    this.data = this.service.getInitialData();
    this.alldata = this.service.getData();
  }

  public getMapSelecionados() {
    if (!this.treeSimple) { return; }
    let sel = this.treeSimple.getMapSelecionados();
    console.log('-----------------------');
    sel?.forEach((v, k) => console.log(`${k}: ${v.texto}`));
    console.log('-----------------------');
  }

  public getIdSelecionados() {
    if (!this.treeSimple) { return; }
    let sel = this.treeSimple.getIdSelecionados();
    console.log('-----------------------');
    sel?.forEach(v => console.log(`${v}`));
    console.log('-----------------------');
  }

  // para o exemplo não vou retornar os subfilhos
  public loadFilhos(id: string): DataTree[] | undefined {
    return this.service.loadFilhos(id);
  }

  public limparSelecao(): void {
    this.treeSimple?.limparSelecao(true);
  }

  public selecionarTodos(): void {
    this.treeSimple?.selecionarTodos();
  }

  public selecionarIds(): void {
    let ids: string[] = ['1', '1.2', '3.3', '3.1'];
    this.treeSimple?.selecionarIds(ids, false, false);
  }

  public limparData(): void {
    this.treeSimple?.limparData();
  }

  public loadAll(): void {
    if (this.alldata === undefined || this.alldata === null || this.alldata.length <= 0) {
      this.alldata = this.service.getData();
    }
    this.treeSimple?.setData(this.alldata, true);
  }

  public loadInitialData(): void {
    this.treeSimple?.setData(this.service.getInitialData(), true);
  }

  public pesquisarArvore(event: any): void {
    let valor = event.target.value;
    if (valor === null || valor === undefined) {
      this.loadAll();
      return;
    }
    let temp: DataTree[] | undefined = this.service.filtrarData(valor);
    console.log('temp: ', temp);
    if (temp === undefined) { return; }
    let idsS = this.treeSimple?.getIdSelecionados();
    this.treeSimple?.setData(temp, true);
    this.treeSimple?.selecionarIds(idsS);
  }

  public loadAllTree(): void {
    this.treeSimple?.loadAll();
  }

}
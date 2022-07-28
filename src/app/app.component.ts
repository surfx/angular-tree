import { Component, ViewChild } from '@angular/core';
import { ArvoreSimpleDataComponent } from './components/arvore-simple-data/arvore-simple-data.component';
import { DataTree } from './entidades/data-tree';
import { DadosArvoreServiceService } from './servicos/dados-arvore-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;

  dados: DataTree[] | undefined;
  alldata: DataTree[] | undefined;

  constructor(private service: DadosArvoreServiceService) {
    this.dados = this.service.getInitialData();
    this.alldata = this.service.getData();
  }

  public getSel() {
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
    this.treeSimple?.limparSelecao();
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

  public testeIds(): void {
    let ids: string[] = ['1', '2', '3', '4'];
    let id = '5';

    console.log(ids.indexOf(id));
  }

  public loadAll(): void {
    if (this.alldata === undefined || this.alldata === null || this.alldata.length <= 0) {
      this.alldata = this.service.getData();
    }
    this.dados = this.alldata;
    this.treeSimple?.setData(this.dados);
    this.setarJaClicado(this.dados);
  }

  public loadInitialData(): void {
    this.dados = this.service.getInitialData();
  }

  private setarJaClicado(data: DataTree[] | undefined): void {
    if (data === null || data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      d.jaClicado = d.temFilhos();
      if (d.temFilhos()) {
        this.setarJaClicado(d.filhos);
      }
    });
  }


  public pesquisarArvore(event: any): void {
    let valor = event.target.value;
    if (valor === null || valor === undefined) {
      this.loadAll();
      return;
    }
    let temp: DataTree[] | undefined = this.service.filtrarData(valor);
    console.log(temp);
    if (temp === undefined) { return; }
    this.dados = temp;
    this.treeSimple?.setData(temp);
  }

  public loadAllTree(): void {
    this.treeSimple?.loadAll();
  }

}
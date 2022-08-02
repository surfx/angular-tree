import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { IdsSelecionadosService } from 'src/app/servicos/ids-selecionados.service';
import { ArvoreSimpleDataComponent } from '../arvore-simple-data/arvore-simple-data.component';

@Component({
  selector: 'app-paginainicial',
  templateUrl: './paginainicial.component.html',
  styleUrls: ['./paginainicial.component.css']
})
export class PaginainicialComponent implements AfterViewInit {

  @ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;

  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  constructor(
    private service: DadosArvoreService,
    private idsSelServ: IdsSelecionadosService
  ) {
    this.data$ = this.service.getInitialData();
    this.alldata = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.data$?.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data);
    });
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
  public loadFilhos(id: string): Observable<DataTree[] | undefined> | undefined {
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
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) { return; }
    obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
    });
  }

  public pesquisarArvore(event: any): void {
    let valor = event.target.value;
    if (valor === null || valor === undefined) {
      this.loadAll();
      return;
    }
    let temp: Observable<DataTree[] | undefined> | undefined = this.service.filtrarData(valor);
    if (temp === undefined) { return; }
    let idsS = this.treeSimple?.getIdSelecionados();
    temp.subscribe(dados => {
      if (dados === undefined) { return; }
      this.treeSimple?.setData(dados, true);
      this.treeSimple?.selecionarIds(idsS);
    });
  }

  public onKeyupEvent(event: any): void {
    if (event === undefined) {
      this.loadInitialData();
      return;
    }
    let valor = event.target.value;
    if (valor === undefined || valor.length <= 0) {
      this.loadInitialData();
      return;
    }
    let temp: Observable<DataTree[] | undefined> | undefined = this.service.filtrarData(valor);
    if (temp === undefined) { return; }
    let idsS = this.treeSimple?.getIdSelecionados();
    temp.subscribe(dados => {
      if (dados === undefined) { return; }
      this.treeSimple?.setData(dados, true);
      this.treeSimple?.selecionarIds(idsS);
    });
  }

  public loadAllTree(): void {
    this.loadInitialData(); // o load all tree precisa que a árvore possua dados iniciais
    this.treeSimple?.loadAll();
  }

  //----
  public getSelecionadosServico(): void {
    if (this.idsSelServ === undefined) { return; }
    console.log(this.idsSelServ.getIdsSelecionados());
  }

  public getSelecionadosServicoItemSelecionado(): string[] | undefined {
    if (this.idsSelServ === undefined) { return undefined; }
    return this.idsSelServ.getItemsSelecionados()?.map(item => item.toString());
  }

}
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

  private _dataInicial: DataTree[] | undefined; // memória

  constructor(
    private service: DadosArvoreService,
    private idsSelServ: IdsSelecionadosService
  ) {
    this.data$ = this.service.getInitialData();
    this.service.getData()?.subscribe(dados => this.alldata = dados);
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
    this.treeSimple?.selecionarIds(ids, true, false);
  }

  public limparData(): void {
    this._dataInicial = undefined;
    this.treeSimple?.limparData();
    this.limparSelecao();
  }

  public loadAll(): void {
    if (this.alldata === undefined || this.alldata === null || this.alldata.length <= 0) {
      this.service.getData()?.subscribe(dados => this.alldata = dados);
    }
    this.treeSimple?.setData(this.alldata, true);
  }

  public loadInitialData(): void {
    if (this._dataInicial !== undefined && this._dataInicial.length > 0) {
      this.delay(30).then(any => {
        this.treeSimple?.setData(this._dataInicial);
        this.treeSimple?.closeExpandAllNodes(true);
      });
      return;
    }
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) { return; }
    obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
      this._dataInicial = data;
    });
  }

  // public loadInitialData(): void {
  //   let obs$ = this.service.getInidadostialData();
  //   if (obs$ === undefined) { return; }
  //   obs$.subscribe(data => {
  //     if (data === undefined) { return; }
  //     this.treeSimple?.setData(data, true);
  //   });
  // }

  //#region Filtrar Árvore
  public pesquisarArvore(event: any): void {
    this.filtrarArvore(event);
  }

  public onKeyupEvent(event: any): void {
    this.filtrarArvore(event);
  }

  private filtrarArvore(event: any): void {
    if (event === undefined) {
      //this.loadInitialData();
      this.treeSimple?.closeExpandAllNodes();
      return;
    }
    let valor = event.target.value;
    if (valor === undefined || valor.length <= 0) {
      //this.loadInitialData();
      this.treeSimple?.closeExpandAllNodes();
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
  //#endregion

  public loadAllTree(): void {
    this.loadInitialData(); // o load all tree precisa que a árvore possua dados iniciais
    this.treeSimple?.loadAll();
  }

  public collapseTree(): void {
    this.treeSimple?.closeExpandAllNodes();
  }

  public expandTree(): void {
    this.treeSimple?.closeExpandAllNodes(true);
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



  public testeAddFilho2(): void {
    this.loadInitialData();
    this.delay(300).then(any => {
      if (this.treeSimple === undefined || this.treeSimple.dados === undefined) { return; }
      if (this.treeSimple.dados !== undefined) {
        this.treeSimple.dados.forEach(d => {
          this.loadChieldsAux(d);
        });
      }
    });
  }

  private loadChieldsAux(item: DataTree | undefined): void {
    if (item === undefined) { return; }
    this.service.loadFilhos(item.id)?.subscribe(filhos => {
      if (filhos === undefined) { return; }
      item.filhos = [];
      filhos.forEach(f => {
        if (f === undefined) { return; }
        item.addFilho(f, false);

        this.loadChieldsAux(f);
      });
      // if (d.temFilhos() && d.filhos !== undefined) {
      //   d.filhos.forEach(f => {
      //     this.loadChieldsAux(d.filhos);
      //   });
      // }
    });
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
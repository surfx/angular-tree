import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { IdsSelecionadosService } from 'src/app/servicos/ids-selecionados.service';
import { ArvoreSimpleRecursiveComponent } from '../tree/arvore-simple-recursive/arvore-simple-recursive.component';

@Component({
  selector: 'app-paginamodal',
  templateUrl: './paginamodal.component.html',
  styleUrls: ['./paginamodal.component.css']
})
export class PaginamodalComponent implements AfterViewInit {

  mostrar: boolean = true;
  showOverlay: boolean = true;

  @ViewChild('tree_simple') treeSimple: ArvoreSimpleRecursiveComponent | undefined;

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
    this.loadInitialData();

    // if (this.treeSimple !== undefined){
    //   this.treeSimple.loadAll();
    // }
  }

  toggle() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) { this.loadInitialData(); }
  }

  private loadInitialData(): void {
    if (this._dataInicial !== undefined) {
      this.delay(30).then(any => {
        this.treeSimple?.setData(this._dataInicial);
        this.treeSimple?.closeExpandAllNodes(true);
      });
      return;
    }
    this.data$?.subscribe(data => {
      if (data === undefined) { return; }
      this._dataInicial = data;
      this.treeSimple?.setData(data);
    });
  }

  public getSelecionadosServico(): void {
    if (this.idsSelServ === undefined) { return; }
    console.log(this.idsSelServ.getIdsSelecionados());
  }

  public getSelecionadosServicoItemSelecionado(): string[] | undefined {
    if (this.idsSelServ === undefined) { return undefined; }
    return this.idsSelServ.getItemsSelecionados()?.map(item => item.toString());
  }

  //#region Filtrar Árvore
  public pesquisarArvore(event: any): void {
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

  public limparSelecao(): void {
    this.treeSimple?.limparSelecao(true);
  }

  public selecionarTodos(): void {
    this.treeSimple?.selecionarTodos();
  }

  public loadAllTree(): void {
    this.loadInitialData(); // o load all tree precisa que a árvore possua dados iniciais
    this.treeSimple?.loadAll();
  }

  public estadoColapse: boolean = false;
  public collapseExpandTree(): void {
    this.treeSimple?.closeExpandAllNodes(this.estadoColapse);
    this.estadoColapse = !this.estadoColapse;
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
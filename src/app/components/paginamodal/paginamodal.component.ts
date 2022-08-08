import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { TreeSimpleComponent } from '../tree/tree-simple/tree-simple.component';

@Component({
  selector: 'app-paginamodal',
  templateUrl: './paginamodal.component.html',
  styleUrls: ['./paginamodal.component.css']
})
export class PaginamodalComponent implements AfterViewInit {

  mostrar: boolean = true;
  showOverlay: boolean = true;

  @ViewChild('tree_simple') treeSimple: TreeSimpleComponent | undefined;
  @ViewChild('input_filter') inputFilterTree: ElementRef | undefined;

  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  private _dataInicial: DataTree[] | undefined; // memória

  constructor(
    private service: DadosArvoreService
  ) {
    this.data$ = this.service.getInitialData();
    let subscriber = this.service.getData()?.subscribe(dados => { this.alldata = dados; subscriber?.unsubscribe(); });
  }

  ngAfterViewInit(): void {
    this.loadInitialData();

    // if (this.treeSimple !== undefined){
    //   this.treeSimple.loadAll();
    // }
  }

  //private _ids: string[] | undefined;
  toggle() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) {
      this.loadInitialData(false)?.subscribe(_ => {
        console.log('-- loaded');
      });
      // if (this._ids !== undefined) {
      //   console.log(this._ids);
      //   this.treeSimple?.selecionarIds(this._ids);
      // }
    } else {
      // this._ids = this.treeSimple?.getIdSelecionados();
    }

    this.selecionados = this.getSelecionados();
  }

  public loadInitialData(limparDataInicial: boolean = true): Subject<void> | undefined {
    if (this.treeSimple === undefined) { return undefined; }
    //let idsSelecionados = this.treeSimple.getIdSelecionados();

    this.limparData(false, limparDataInicial);
    if (this._dataInicial !== undefined && this._dataInicial.length > 0) {
      this.delay(30).then(any => {
        this.treeSimple?.setData(this._dataInicial);
        this.treeSimple?.closeExpandAllNodes(true);

        //this.treeSimple?.selecionarIds(idsSelecionados);
      });
      return undefined;
    }
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) {
      return undefined;
    }

    let rt: Subject<void> = new Subject<void>();
    let subscriber = obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
      this._dataInicial = data;

      //this.treeSimple?.selecionarIds(idsSelecionados);

      rt.next();
      subscriber.unsubscribe();
    });
    return rt;
  }

  // private loadInitialData(): void {
  //   if (this._dataInicial !== undefined) {
  //     this.delay(30).then(any => {
  //       this.treeSimple?.setData(this._dataInicial);
  //       this.treeSimple?.closeExpandAllNodes(true);
  //     });
  //     return;
  //   }
  //   let subscriber = this.data$?.subscribe(data => {
  //     if (data === undefined) { return; }
  //     this._dataInicial = data;
  //     this.treeSimple?.setData(data);
  //     subscriber?.unsubscribe();
  //   });
  // }

  //#region Filtrar Árvore
  private houveFiltro: boolean = false;
  public pesquisarArvore(event: any): void {
    if (event === undefined) {
      if (this.houveFiltro) {
        let subscriber = this.loadInitialData()?.subscribe(_ => {
          this.treeSimple?.closeExpandAllNodes();
          subscriber?.unsubscribe();
        });
        this.houveFiltro = false;
      }
      this.treeSimple?.closeExpandAllNodes();
      return;
    }
    let valor = event.target.value;
    if (valor === undefined || valor.length <= 0) {
      if (this.houveFiltro) {
        let subscriber = this.loadInitialData()?.subscribe(_ => {
          this.treeSimple?.closeExpandAllNodes();
          subscriber?.unsubscribe();
        });
        this.houveFiltro = false;
      }
      this.treeSimple?.closeExpandAllNodes();
      return;
    }
    let temp: Observable<DataTree[] | undefined> | undefined = this.service.filtrarData(valor);
    if (temp === undefined) { return; }

    // temp.subscribe(dados => {
    //   if (dados === undefined) { return; }
    //   this.treeSimple?.limparData();

    //   this.houveFiltro = true;
    //   this.treeSimple?.setData(dados, false);
    //   this.treeSimple?.setAllJaClicado(); // evitar loading de novos filhos - não alterar o filtro
    //   //this.treeSimple?.selecionarIds(idsS);

    // });

    let subscriber = temp.subscribe(dados => {
      if (dados === undefined) { subscriber.unsubscribe(); return; }
      this.houveFiltro = true;
      this.delay(30).then(any => {
        this.treeSimple?.setData(dados, false);
        this.treeSimple?.setAllJaClicado(); // evitar loading de novos filhos - não alterar o filtro
      });
      subscriber.unsubscribe();
    });
  }
  //#endregion

  public limparSelecao(limparMemoria: boolean): void {
    this.treeSimple?.limparSelecao(limparMemoria);
  }

  public selecionarTodos(): void {
    this.treeSimple?.selecionarTodos();
  }

  public loadAllTree(): void {
    // o load all tree precisa que a árvore possua dados iniciais
    let subscriber = this.loadInitialData()?.subscribe(_ => {
      if (this.treeSimple !== undefined) {
        this.treeSimple?.loadAll();
      }
      subscriber?.unsubscribe();
    });
    // this.delay(200).then(any => {
    //   this.treeSimple?.loadAll();
    // });
  }

  public estadoColapse: boolean = false;
  public collapseExpandTree(): void {
    this.treeSimple?.closeExpandAllNodes(this.estadoColapse);
    this.estadoColapse = !this.estadoColapse;
  }


  public selecionados: string[] | undefined;
  private getSelecionados(): string[] | undefined {
    if (this.treeSimple === undefined || this.treeSimple.dados === undefined) { return undefined; }
    let map: Map<string, DataTree> | undefined = this.treeSimple.getMapSelecionados();
    if (map === undefined) { return undefined; }
    return [...map.values()].map(item => item.toString());
  }

  public limparData(limparMemoria: boolean, limparDataInicial: boolean = true): void {
    if (limparDataInicial) { this._dataInicial = undefined; }
    this.treeSimple?.limparData();
    this.limparSelecao(limparMemoria);

    this.setInputText('');
  }

  private setInputText(texto: string = ''): void {
    if (this.inputFilterTree !== undefined) {
      this.inputFilterTree.nativeElement.value = texto;
    }
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
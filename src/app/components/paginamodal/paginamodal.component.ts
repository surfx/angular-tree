import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { TreeSimpleComponent } from '../tree/tree-simple/tree-simple.component';

@Component({
  selector: 'app-paginamodal',
  templateUrl: './paginamodal.component.html',
  styleUrls: ['./paginamodal.component.css']
})
export class PaginamodalComponent implements AfterViewInit, OnDestroy {

  mostrar: boolean = true;
  showOverlay: boolean = true;

  @ViewChild('tree_simple') treeSimple: TreeSimpleComponent | undefined;

  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  private _dataInicial: DataTree[] | undefined; // memória

  public filtroInput: string = '';
  filtroInputUpdate: Subject<string> = new Subject<string>();
  private _subsFiltroInput: Subscription | undefined;

  constructor(
    private service: DadosArvoreService
  ) {
    this.data$ = this.service.getInitialData();
    let subscriber = this.service.getData()?.subscribe(dados => { this.alldata = dados; subscriber?.unsubscribe(); });

    this._subsFiltroInput =
      this.filtroInputUpdate.pipe(
        debounceTime(400),
        distinctUntilChanged())
        .subscribe(value => {
          this.pesquisarArvore(value);
        });
  }

  ngAfterViewInit(): void {
    this.loadInitialData();

    // if (this.treeSimple !== undefined){
    //   this.treeSimple.loadAll();
    // }
  }

  ngOnDestroy(): void {
    this._subsFiltroInput?.unsubscribe();
  }

  //private _ids: string[] | undefined;
  toggle() {
    this.mostrar = !this.mostrar;
    if (this.mostrar) {
      this.loadInitialData(false);
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
    if (obs$ === undefined) { return undefined; }

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

  //#region Filtrar Árvore
  private houveFiltro: boolean = false;
  public pesquisarArvore(valor: string): void {
    //let valor = event === undefined ? undefined : event.target.value;
    //event === undefined ||
    if (valor === undefined || valor.length <= 0) {
      if (this.houveFiltro) {
        let lid$ = this.loadInitialData(false);
        if (lid$ === undefined) {
          this.treeSimple?.closeExpandAllNodes(true);
        } else {
          let subscriber = lid$?.subscribe(_ => {
            this.treeSimple?.closeExpandAllNodes(true);
            subscriber?.unsubscribe();
          });
        }
        this.houveFiltro = false;
      }
      //this.treeSimple?.closeExpandAllNodes();
      return;
    }

    let temp: Observable<DataTree[] | undefined> | undefined = this.service.filtrarData(valor);
    if (temp === undefined) { return; }

    let subscriber = temp.subscribe(dados => {
      this.houveFiltro = true;
      if (dados === undefined) {
        this.treeSimple?.limparData();
        subscriber.unsubscribe();
        return;
      }
      this.delay(30).then(_ => {
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
    this.filtroInput = texto;
  }

  public onclickitem(item: DataTree): void {
    //console.log('onclickitem', item);
    //&& item !== undefined && item.temFilhos()
    if (!this.houveFiltro && this.treeSimple !== undefined && this.treeSimple.dados !== undefined) {
      //this._dataInicial = this.treeSimple.dados;
      //console.log('-atribuição');
      //this._dataInicial = ArvoreUtil.mergeDt(this._dataInicial, this.treeSimple.dados);
    }
  }

  public eventfilhoadd(item: DataTree): void {
    //console.log('eventfilhoadd', item);
    if (this.treeSimple === undefined || this.treeSimple.dados === undefined) {
      return;
    }
    if (this._dataInicial === undefined) {
      this._dataInicial = this.treeSimple.dados;
      return;
    }
    // console.log('-- merge data');
    // this._dataInicial = ArvoreUtil.mergeDt(this._dataInicial, this.treeSimple.dados);

    // console.log('-- atualizarFilhos');
    // ArvoreUtil.atualizarFilhos(this._dataInicial, item);
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
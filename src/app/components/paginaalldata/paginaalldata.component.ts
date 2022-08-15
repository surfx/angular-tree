import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, Subscription } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { ArvoreUtil } from 'src/app/util/arvore-util';
import { TreeSimpleComponent } from '../tree/tree-simple/tree-simple.component';

@Component({
  selector: 'app-paginaalldata',
  templateUrl: './paginaalldata.component.html',
  styleUrls: ['./paginaalldata.component.css']
})
export class PaginaalldataComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tree_simple') treeSimple: TreeSimpleComponent | undefined;

  alldata: DataTree[] | undefined;

  public filtroInput: string = '';
  filtroInputUpdate: Subject<string> = new Subject<string>();
  private _subsFiltroInput: Subscription | undefined;

  constructor(
    private service: DadosArvoreService
  ) {
    let subscriber = this.service.getData()?.subscribe(dados => {
      this.alldata = dados;
      this.treeSimple?.setData(this.alldata);
      this.treeSimple?.setAllJaClicado(true);
      subscriber?.unsubscribe();
    });

    this._subsFiltroInput =
      this.filtroInputUpdate.pipe(
        debounceTime(300),
        distinctUntilChanged())
        .subscribe(value => {
          this.pesquisarArvore(value);
        });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this._subsFiltroInput?.unsubscribe();
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

  public limparSelecao(limparMemoria: boolean): void {
    this.treeSimple?.limparSelecao(limparMemoria);
  }

  public selecionarTodos(): void {
    this.treeSimple?.selecionarTodos();
  }

  public selecionarIds(): void {
    let ids: string[] = ['1', '1.2', '3.3', '3.1'];
    //this.treeSimple?.limparSelecao(true);
    this.treeSimple?.selecionarIds(ids, true, false);
  }

  public limparData(limparMemoria: boolean/*, limparDataInicial: boolean = true*/): void {
    // if (limparDataInicial) {
    //   this._dataInicial = undefined;
    // }
    this.treeSimple?.limparData();
    this.limparSelecao(limparMemoria);

    this.setInputText('');
  }

  public loadAll(): void {
    //let idsSelecionados = this.treeSimple?.getIdSelecionados();

    if (this.alldata === undefined || this.alldata === null || this.alldata.length <= 0) {
      let subscriber = this.service.getData()?.subscribe(dados => { this.alldata = dados; subscriber?.unsubscribe(); });
    }
    this.treeSimple?.setData(this.alldata, true);
    //this.treeSimple?.selecionarIds(idsSelecionados);

    this.setInputText('');
  }

  public loadInitialData(/*limparDataInicial: boolean = true*/): Subject<void> | undefined {
    if (this.treeSimple === undefined) { return undefined; }
    //let idsSelecionados = this.treeSimple.getIdSelecionados();

    this.limparData(false/*, limparDataInicial*/);
    if (this.alldata !== undefined && this.alldata.length > 0) {
      //this.delay(200).then(any => {
      this.treeSimple?.limparData();
      this.treeSimple?.setData(this.alldata);
      this.treeSimple?.closeExpandAllNodes(true);

      //this.treeSimple?.selecionarIds(idsSelecionados);
      //});
      return undefined;
    }
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) { return undefined; }

    let rt: Subject<void> = new Subject<void>();
    let subscriber = obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
      //this._dataInicial = data;

      //this.treeSimple?.selecionarIds(idsSelecionados);

      rt.next();
      subscriber.unsubscribe();
    });
    return rt;
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
  public pesquisarArvore(valor: string): void {
    //let valor = event === undefined ? undefined : event.target.value;
    //event === undefined ||
    if (valor === undefined || valor.length <= 0) {
      this.treeSimple?.setData(this.alldata);
      this.treeSimple?.closeExpandAllNodes(true);
      return;
    }

    //let temp: Observable<DataTree[] | undefined> | undefined = this.service.filtrarData(valor);
    // como todos os dados estão em memória:
    let temp: DataTree[] | undefined = ArvoreUtil.findSubTree(this.alldata, valor);
    if (temp === undefined) {
      this.treeSimple?.limparData();
      return;
    }

    this.delay(30).then(_ => {
      this.treeSimple?.setData(temp, false);
      this.treeSimple?.setAllJaClicado(); // evitar loading de novos filhos - não alterar o filtro
    });

  }
  //#endregion

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

  public collapseTree(): void {
    this.treeSimple?.closeExpandAllNodes();
  }

  public expandTree(): void {
    this.treeSimple?.closeExpandAllNodes(true);
  }

  //----
  public getSelecionados(): string[] | undefined {
    if (this.treeSimple === undefined || this.treeSimple.dados === undefined) { return undefined; }
    let map: Map<string, DataTree> | undefined = this.treeSimple.getMapSelecionados();
    if (map === undefined) { return undefined; }
    return [...map.values()].map(item => item.toString());
  }

  private setInputText(texto: string = ''): void {
    this.filtroInput = texto;
  }

  //----
  public onclickitem(item: DataTree): void {
    console.log('onclickitem', item);
  }

  public eventfilhoadd(item: DataTree): void {
    //console.log('eventfilhoadd', item);
    if (this.treeSimple === undefined || this.treeSimple.dados === undefined) {
      return;
    }
    // if (this._dataInicial === undefined) {
    //   this._dataInicial = this.treeSimple.dados;
    //   return;
    // }
    //console.log('-- merge data');
    //this._dataInicial = ArvoreUtil.mergeDt(this._dataInicial, this.treeSimple.dados);
    //console.log('2 this._dataInicial set');

    //console.log('-- atualizarFilhos'); // - se justifica para loads incrementais
    //ArvoreUtil.atualizarFilhos(this._dataInicial, item);
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { TreeSimpleComponent } from '../tree/tree-simple/tree-simple.component';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements AfterViewInit, OnInit {


  //@ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;
  @ViewChild('tree_simple') treeSimple: TreeSimpleComponent | undefined;
  @ViewChild('input_filter') inputFilterTree: ElementRef | undefined;


  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  private _dataInicial: DataTree[] | undefined; // memória

  constructor(
    private service: DadosArvoreService
  ) {
    this.data$ = this.service.getInitialData();
    this.service.getData()?.subscribe(dados => this.alldata = dados);
  }

  ngOnInit(): void {
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

  public limparData(limparMemoria: boolean): void {
    this._dataInicial = undefined;
    this.treeSimple?.limparData();
    this.limparSelecao(limparMemoria);

    this.setInputText('');
  }

  public loadAll(): void {
    //let idsSelecionados = this.treeSimple?.getIdSelecionados();

    if (this.alldata === undefined || this.alldata === null || this.alldata.length <= 0) {
      this.service.getData()?.subscribe(dados => this.alldata = dados);
    }
    this.treeSimple?.setData(this.alldata, true);
    //this.treeSimple?.selecionarIds(idsSelecionados);

    this.setInputText('');
  }

  public loadInitialData(): void {
    if (this.treeSimple === undefined) { return; }
    //let idsSelecionados = this.treeSimple.getIdSelecionados();

    this.limparData(false);
    if (this._dataInicial !== undefined && this._dataInicial.length > 0) {
      this.delay(30).then(any => {
        this.treeSimple?.setData(this._dataInicial);
        this.treeSimple?.closeExpandAllNodes(true);

        //this.treeSimple?.selecionarIds(idsSelecionados);
      });
      return;
    }
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) { return; }
    obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
      this._dataInicial = data;

      //this.treeSimple?.selecionarIds(idsSelecionados);
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
  private houveFiltro: boolean = false;
  public pesquisarArvore(event: any): void {
    if (event === undefined) {
      if (this.houveFiltro) {
        this.loadInitialData();
        this.houveFiltro = false;
      }
      this.treeSimple?.closeExpandAllNodes();
      return;
    }
    let valor = event.target.value;
    if (valor === undefined || valor.length <= 0) {
      if (this.houveFiltro) {
        this.loadInitialData();
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

    temp.subscribe(dados => {
      if (dados === undefined) { return; }
      this.houveFiltro = true;
      this.delay(30).then(any => {
        this.treeSimple?.setData(dados, false);
        this.treeSimple?.setAllJaClicado(); // evitar loading de novos filhos - não alterar o filtro
      });
    });
  }
  //#endregion

  public loadAllTree(): void {
    this.loadInitialData(); // o load all tree precisa que a árvore possua dados iniciais
    this.delay(200).then(any => {
      this.treeSimple?.loadAll();
    });
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
    if (this.inputFilterTree !== undefined) {
      this.inputFilterTree.nativeElement.value = texto;
    }
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
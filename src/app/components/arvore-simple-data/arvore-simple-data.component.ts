import { AfterContentChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { IdsSelecionadosService } from 'src/app/servicos/ids-selecionados.service';


@Component({
  selector: 'app-arvore-simple-data',
  templateUrl: './arvore-simple-data.component.html',
  styleUrls: ['./arvore-simple-data.component.css']
})
export class ArvoreSimpleDataComponent implements OnInit, OnDestroy, AfterContentChecked {

  @Input('ExibirCheckBox') ExibirCheckBox: boolean | undefined;
  @Input('ControlarSelecionados') ControlarSelecionados: boolean | undefined;
  @Input('multiplaSelecao') multiplaSelecao: boolean | undefined;
  @Output() clearAllSel: EventEmitter<void> = new EventEmitter<void>(); // event para limpar a seleção de todos os componentes

  //@Input('dados') dados: DataTree[] | undefined;
  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) {
    this._dados = Object.assign([], data);
  }
  get dados(): DataTree[] | undefined { return this._dados; }

  // add filho
  private _subscriptions: Subscription[] = [];
  public hasData: boolean = false;

  constructor(
    private service: DadosArvoreService,
    private idsSelServ: IdsSelecionadosService
  ) { }

  ngOnInit(): void {

  }

  ngAfterContentChecked(): void {
    // evitar o erro NG0100
    this.hasData = this.dados !== null && this.dados !== undefined && this.dados.length > 0;
  }

  ngOnDestroy(): void {
    if (this._subscriptions !== undefined && this._subscriptions.length > 0) {
      this._subscriptions.forEach(s => { if (s !== undefined) { s.unsubscribe(); } });
    }
  }

  public setData(data: DataTree[] | undefined, ajustarLoading: boolean = false): void {
    this.dados = Object.assign([], data);

    if (this.dados !== undefined) { this.dados.forEach(d => this.limparSelecionadosEntrada(d)); }
    if (ajustarLoading && this.dados !== undefined) {
      this.ajustarLoadingJaClicado(this.dados);
    }

    this.selecionarFromService();
  }

  private limparSelecionadosEntrada(item: DataTree | undefined): void {
    if (item === undefined) { return; }
    item.selecionado = false;
    if (item.temFilhos() && item.filhos !== undefined) {
      item.filhos.forEach(f => this.limparSelecionadosEntrada(f));
    }
  }

  //#region imagens
  public getImg(item: DataTree): string {
    let imgClosed = "../../../assets/imagens/seta_dir_two.svg";
    let imgOpened = "../../../assets/imagens/seta_baixo_two.svg";
    let imgEmpty = "../../../assets/imagens/seta_empty_two.svg";
    let imgDotted = "../../../assets/imagens/seta_dir_dotted.svg";
    if (item === null || item === undefined) { return imgEmpty; }
    if (!item.jaClicado) { // pode ser que tenha filhos
      return imgDotted;
    }
    if (!item.temFilhos()) { return imgEmpty; }
    return !item.aberto ? imgClosed : imgOpened;
  }

  public getImgClass(item: DataTree): string {
    let classImgClosed = "arrow_right_two_little";
    let classImgOpened = "arrow_down_two_little";
    let classImgDotted = "arrow_right_two_little_dotted";
    if (item === null || item === undefined) { return classImgClosed; }
    if (!item.jaClicado) { // pode ser que tenha filhos
      return classImgDotted;
    }
    return !item.aberto ? classImgClosed : classImgOpened;
  }

  public clickImg = (item: DataTree) => {
    item.aberto = !item.aberto;
    //item.selecionarFilhos();
  }
  //#endregion

  public clickLabel = (item: DataTree | undefined, controlCheck: boolean = false) => {
    if (!this.ok(item) || item === undefined) { return; }
    //item.selecionado = !item.selecionado;
    //console.log('click li: ', item);
    item.aberto = true;

    this.loadAndSetFilhos(item);

    //item.selecionado = true;
    let jaClicadoMem = item.jaClicado;
    item.jaClicado = true;
    //item.aberto = !item.aberto;

    //item.selecionarFilhos();
    if (!controlCheck) { return; }

    let isSel = item.selecionado;
    if (!this.multiplaSelecao) {
      this.clearAllSel.emit();
      this.limparSelecao(true);
    }

    // não vou fazer esse controle, pode ficar confuso para o usuário
    //if (jaClicadoMem) { item.selecionado = !isSel; }
    item.selecionado = !isSel;


    if (this.ControlarSelecionados) {
      // manter estado dos selecionados
      this.idsSelServ.auxIdsSelecionados(item);
    }
  }

  private loadAndSetFilhos(item: DataTree | undefined): void {
    if (!this.ok(item) || item === undefined || item.id === undefined || item.jaClicado) { return; }
    item.isLoading = true;
    item.filhos = []; // evitar que filhos sejam re-adds

    let filhos$: Observable<DataTree[] | undefined> | undefined = this.service.loadFilhos(item.id);
    if (filhos$ === null || filhos$ === undefined) {
      item.isLoading = false;
      return;
    }

    filhos$.subscribe(filhosData => {
      item.isLoading = false;
      if (filhosData === undefined) { return; }
      filhosData.forEach(f => {
        item.addFilho(f, false);
      });
      item.aberto = true;
    });
  }

  public checkValue(item: DataTree) {
    let isSel = item.selecionado;
    if (!this.multiplaSelecao) {
      this.clearAllSel.emit();
      this.limparSelecao(true);
    }

    item.selecionado = !isSel;
    if (this.multiplaSelecao) {
      item.selecionarFilhos();
    }

    if (this.ControlarSelecionados) {
      // manter estado dos selecionados
      this.idsSelServ.auxIdsSelecionados(item);
    }
  }

  // private loadFilhos(id: string): Observable<DataTree[] | undefined> | undefined {
  //   if (id === null || id === undefined) { return; }
  //   return this.service.loadFilhos(id);
  // }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

  //#region get selecionados
  public getMapSelecionados(): Map<string, DataTree> | undefined {
    if (this.dados === undefined) { return undefined; }
    return this.getMapSelecionadosAux(this.dados);
  }

  private getMapSelecionadosAux(data: DataTree[]): Map<string, DataTree> | undefined {
    let rt: Map<string, DataTree> | undefined = undefined;
    if (!this.ok(data) || data.length <= 0) { return rt; }

    rt = new Map<string, DataTree>();
    data.forEach(d => {
      if (!this.ok(d)) { return; }
      if (d.selecionado) {
        rt?.set(d.id, d);
      }
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      let aux = this.getMapSelecionadosAux(d.filhos);
      if (aux === undefined || aux === null || aux.size <= 0) { return; }
      aux.forEach(a => {
        if (!a.selecionado) { return; }
        rt?.set(a.id, a);
      });
    });
    return rt;
  }

  public getIdSelecionados(): string[] | undefined {
    if (this.dados === undefined) { return undefined; }
    return this.getIdSelecionadosAux(this.dados);
  }

  private getIdSelecionadosAux(data: DataTree[]): string[] | undefined {
    let rt: string[] | undefined = undefined;
    if (!this.ok(data) || data.length <= 0) { return rt; }

    rt = [];
    data.forEach(d => {
      if (!this.ok(d)) { return; }
      if (d.selecionado) {
        rt?.push(d.id);
      }
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      let aux = this.getIdSelecionadosAux(d.filhos);
      if (aux === undefined || aux === null || aux.length <= 0) { return; }
      aux.forEach(a => rt?.push(a));
    });
    return rt;
  }
  //#endregion

  //#region aux selecionar
  // Event
  public clearAllSelEvent(): void {
    if (this.multiplaSelecao) { return; }
    this.limparSelecao(true);
    if (this.clearAllSel !== undefined) {
      this.clearAllSel.emit(); // propagar o evento aos pais
    }
  }

  public limparSelecao(limparService: boolean = true): void {
    this.selecionarDados(this.dados, false);
    if (limparService && this.ControlarSelecionados) { this.idsSelServ.clearData(); }
  }

  public selecionarTodos(): void {
    if (!this.multiplaSelecao) {
      console.info('Multipla seleção desabilitada');
      return;
    }
    this.selecionarDados(this.dados, true);
    this.atualizarServicoSelecionados();
  }

  private selecionarDados(data: DataTree[] | undefined, selecionar: boolean): void {
    if (data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      if (!this.ok(d)) { return; }
      d.selecionado = selecionar;
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      this.selecionarDados(d.filhos, selecionar);
    });
  }

  public selecionarIds(ids: string[] | undefined, desmarcarDemais: boolean = false, selecionarFilhos: boolean = false): void {
    if (ids === undefined) { return; }
    if (desmarcarDemais) { this.limparSelecao(true); }
    if (!this.ok(this.dados) || !this.ok(ids) || ids.length <= 0) { return; }
    if (!this.multiplaSelecao) { ids = [ids[0]]; }
    this.selIds(this.dados, ids, selecionarFilhos);

    this.atualizarServicoSelecionados();
  }

  private selIds(data: DataTree[] | undefined, ids: string[], selecionarFilhos: boolean = false): void {
    if (!this.ok(data) || data === undefined || !this.ok(ids) || ids.length <= 0) { return; }
    data.forEach(d => {
      if (!this.ok(d)) { return; }
      if (ids.indexOf(d.id) >= 0) {
        d.selecionado = true;
        if (selecionarFilhos) {
          d.selecionarFilhos();
        }
      }
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      this.selIds(d.filhos, ids, selecionarFilhos);
    });
  }
  //#endregion

  public limparData(): void {
    this.dados = [];
  }

  public loadAll(): void {
    // if (this.dados===undefined||this.dados[0]===undefined){return;}
    // this.loadAndSetFilhos(this.dados[0]);
    // console.log(this.dados[0].filhos);

    this.delay(400).then(any => {
      this.dados?.forEach(d => this.loadAllAux(d));
      if (this.dados !== undefined) { this.dados.forEach(d => this.limparSelecionadosEntrada(d)); }
      this.selecionarFromService();
    });
  }

  private loadAllAux(data: DataTree | undefined): void {
    if (!this.ok(data) || data === undefined) { return; }
    this.clickLabel(data);

    if (data.temFilhos()) {
      data.filhos?.forEach(f => {
        this.loadAllAux(f);
      });
    }
    let subs: Subscription =
      data.filhoAdicionado.subscribe(fadd => {
        this.loadAllAux(fadd);
      });
    this._subscriptions.push(subs);

    this.selecionarFromService();
  }

  //#region close all nodes
  public closeExpandAllNodes(expandir: boolean = false): void {
    if (!this.ok(this.dados) || this.dados === undefined) { return; }
    this.closeExpandAllNodesAux(this.dados, expandir);
  }
  private closeExpandAllNodesAux(data: DataTree[] | undefined, expandir: boolean = false): void {
    if (!this.ok(data) || data === undefined) { return; }
    data.forEach(d => {
      d.aberto = expandir;
      if (!d.temFilhos || d.filhos === undefined) { return; }
      this.closeExpandAllNodesAux(d.filhos, expandir);
    });
  }
  //#endregion


  //#region ajustes Ja Clicado
  private ajustarLoadingJaClicado(data: DataTree[] | undefined): void {
    if (data === null || data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      d.jaClicado = d.temFilhos();
      if (d.temFilhos()) {
        this.ajustarLoadingJaClicado(d.filhos);
      }
    });
  }

  public setAllJaClicado(jaClicado: boolean = true): void {
    this.setAllJaClicadoAux(this.dados, jaClicado);
  }
  private setAllJaClicadoAux(data: DataTree[] | undefined, jaClicado: boolean): void {
    if (data === null || data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      d.jaClicado = jaClicado;
      if (d.temFilhos() && this.ok(d.filhos)) {
        this.ajustarLoadingJaClicado(d.filhos);
      }
    });
  }
  //#endregion

  //#region serviço selecionados
  private atualizarServicoSelecionados(): void {
    if (!this.ControlarSelecionados) { return; }
    this.idsSelServ.auxIdsSelecionadosData(this.dados);
  }

  private selecionarFromService(): void {
    if (!this.ControlarSelecionados) { return; }
    // manter estado dos selecionados
    this.limparSelecao(false);
    this.selecionarIds(this.idsSelServ.getIdsSelecionados());
  }
  //#endregion

  private ok = (el: any): boolean => el !== undefined && el !== null && el;

  public trackItem(index: number, item: DataTree) {
    return item.id;
  }

}
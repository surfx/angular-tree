import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';

@Component({
  selector: 'app-tree-simple',
  templateUrl: './tree-simple.component.html',
  styleUrls: ['./tree-simple.component.css']
})
export class TreeSimpleComponent implements OnInit, AfterContentChecked {

  @Input('ExibirCheckBox') ExibirCheckBox: boolean | undefined;
  @Input('MultiplaSelecao') MultiplaSelecao: boolean | undefined;
  @Output('ClickItem') ClickItem: EventEmitter<DataTree> = new EventEmitter<DataTree>();

  //@Input('dados') dados: DataTree[] | undefined;
  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) {
    this._dados = Object.assign([], data);
    this.updateHasData();
  }
  get dados(): DataTree[] | undefined { return this._dados; }

  public hasData: boolean = false;

  private _mapSelecionados: Map<string, DataTree> = new Map<string, DataTree>();

  constructor(private service: DadosArvoreService) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    // evitar o erro NG0100
    this.updateHasData();
  }

  public setData(data: DataTree[] | undefined, ajustarLoading: boolean = false): void {
    let idsSelecionados = this.getIdSelecionados();
    this.dados = Object.assign([], data);
    this.updateHasData();

    //if (this.dados !== undefined) { this.dados.forEach(d => this.limparSelecionadosEntrada(d)); }
    this.limparSelecao(false);
    if (ajustarLoading && this.dados !== undefined) {
      this.ajustarLoadingJaClicado(this.dados);
    }

    if (idsSelecionados !== undefined) { this.selecionarIds(idsSelecionados); }
  }

  private updateHasData(): void {
    this.hasData = this.dados !== null && this.dados !== undefined && this.dados.length > 0;
  }

  public limparData(): void {
    this.dados = [];
  }

  //#region imagens
  public getImg(item: DataTree): string {
    let imgClosed = "../../../../assets/tree_imagens/seta_dir_two.svg";
    let imgOpened = "../../../../assets/tree_imagens/seta_baixo_two.svg";
    let imgEmpty = "../../../../assets/tree_imagens/seta_empty_two.svg";
    let imgDotted = "../../../../assets/tree_imagens/seta_dir_dotted.svg";
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
  }
  //#endregion

  /**
   * click label e checkbox
   * @param item 
   * @param selFilhos true: seleciona também os filhos - caso click checkbox
   * @returns 
   */
  public clickLabel(item: DataTree | undefined, selFilhos: boolean = false): void {
    if (item === undefined) { return; }
    item.aberto = true;
    this.loadAndSetFilhos(item);

    let isSelMem = item.selecionado;
    if (!this.MultiplaSelecao) { this.limparSelecao(); }
    item.selecionado = !isSelMem;

    if (this.MultiplaSelecao && selFilhos) {
      item.selecionarFilhos();
    }

    if (this.ClickItem !== undefined) { this.ClickItem.emit(item); }
    this.atualizarSelecionadosMem(item);
  }

  //#region get selecionados
  // retorna todos os selecionados, independentemente do filtro aplicado
  public getMapSelecionados(): Map<string, DataTree> | undefined {
    return this._mapSelecionados;
  }

  // retorna todos os selecionados, independentemente do filtro aplicado
  public getIdSelecionados(): string[] | undefined {
    if (this._mapSelecionados === undefined) { return undefined; }
    return [...this._mapSelecionados.keys()];
  }

  public getDataTreeSelecionados(): DataTree[] | undefined {
    if (this._mapSelecionados === undefined) { return undefined; }
    return [...this._mapSelecionados.values()];
  }
  //#endregion

  //#region aux selecionaritem
  /**
   * limpa a seleção de todos os itens
   * @param limparMemoria limpa a memória dos itens selecionados
   */
  public limparSelecao(limparMemoria: boolean = false): void {
    this.selecionarDadosAux(this.dados, false);
    if (limparMemoria) { this._mapSelecionados.clear(); }
  }

  /**
   * seleciona todos os itens
   * @returns 
   */
  public selecionarTodos(): void {
    if (!this.MultiplaSelecao) {
      console.info('Multipla seleção desabilitada');
      return;
    }
    this.selecionarDadosAux(this.dados, true);
  }

  /**
   * Auxiliar para selecionar/deselecionar todos os dados
   * @param data 
   * @param selecionar 
   * @returns 
   */
  private selecionarDadosAux(data: DataTree[] | undefined, selecionar: boolean): void {
    if (data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      if (d === undefined) { return; }
      d.selecionado = selecionar;
      this.atualizarSelecionadosMem(d);
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      this.selecionarDadosAux(d.filhos, selecionar);
    });
  }

  /**
   * Seleciona os itens pelo id.
   * Caso o componente não permita múltipla seleção, marca apenas o primeiro id
   * @param ids 
   * @param desmarcarDemais true: deixa selecionado apenas os ids informados. false: não interfere na seleção de itens já marcados
   * @param selecionarFilhos true: seleciona todos os filhos dos itens dos ids informados
   * @returns 
   */
  public selecionarIds(ids: string[] | undefined, desmarcarDemais: boolean = false, selecionarFilhos: boolean = false): void {
    if (desmarcarDemais) { this.limparSelecao(true); }
    if (this.dados === undefined || ids === undefined || ids.length <= 0) { return; }
    if (!this.MultiplaSelecao) { ids = [ids[0]]; }
    this.selIdsAux(this.dados, ids, selecionarFilhos);
  }

  /**
   * Auxiliar da seleção por ids
   * @param data 
   * @param ids 
   * @param selecionarFilhos 
   * @returns 
   */
  private selIdsAux(data: DataTree[] | undefined, ids: string[], selecionarFilhos: boolean = false): void {
    if (data === undefined || ids === undefined || ids.length <= 0) { return; }
    data.forEach(d => {
      if (d === undefined) { return; }
      if (ids.indexOf(d.id) >= 0) {
        d.selecionado = true;
        this.atualizarSelecionadosMem(d);
        if (selecionarFilhos) {
          d.selecionarFilhos();
        }
      }
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      this.selIdsAux(d.filhos, ids, selecionarFilhos);
    });
  }
  //#endregion

  //#region close all nodes
  /**
   * Fecha ou expande todos os nodops
   * @param expandir 
   * @returns 
   */
  public closeExpandAllNodes(expandir: boolean = false): void {
    if (this.dados === undefined) { return; }
    this.closeExpandAllNodesAux(this.dados, expandir);
  }
  private closeExpandAllNodesAux(data: DataTree[] | undefined, expandir: boolean = false): void {
    if (data === undefined) { return; }
    data.forEach(d => {
      d.aberto = expandir;
      if (!d.temFilhos || d.filhos === undefined) { return; }
      this.closeExpandAllNodesAux(d.filhos, expandir);
    });
  }
  //#endregion

  //#region ajustes Ja Clicado
  /**
   * ajusta o parâmetro jaClicado para true se o item tiver filhos.
   * Motivação: evitar chamar 'loadAndSetFilhos' para itens que já tenham filhos
   * @param data 
   * @returns 
   */
  private ajustarLoadingJaClicado(data: DataTree[] | undefined): void {
    if (data === null || data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      d.jaClicado = d.temFilhos();
      if (d.temFilhos()) {
        this.ajustarLoadingJaClicado(d.filhos);
      }
    });
  }

  /**
   * Marca o parâmetro jaClicado como true/false para todos os elementos
   * @param jaClicado 
   */
  public setAllJaClicado(jaClicado: boolean = true): void {
    this.setAllJaClicadoAux(this.dados, jaClicado);
  }
  private setAllJaClicadoAux(data: DataTree[] | undefined, jaClicado: boolean): void {
    if (data === null || data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      d.jaClicado = jaClicado;
      if (d.temFilhos() && d.filhos !== undefined) {
        this.setAllJaClicadoAux(d.filhos, jaClicado);
      }
    });
  }
  //#endregion

  //#region Load Chields
  /**
   * adiciona os filhos para um determinado item
   * @param item 
   * @returns 
   */
  private loadAndSetFilhos(item: DataTree | undefined): void {
    if (item === undefined || item.id === undefined || item.jaClicado) { return; }
    item.isLoading = true;
    item.jaClicado = true;
    item.filhos = []; // evitar que filhos sejam re-adds

    let filhos$: Observable<DataTree[] | undefined> | undefined = this.service.loadFilhos(item.id);
    if (filhos$ === null || filhos$ === undefined) {
      item.isLoading = false;
      return;
    }

    let subscriber = filhos$.subscribe(filhosData => {
      item.isLoading = false;
      if (filhosData === undefined) { subscriber.unsubscribe(); return; }
      filhosData.forEach(f => {
        item.addFilho(f, false);
      });
      item.aberto = true;
      subscriber.unsubscribe();
    });
  }

  /**
   * carrega e seta todos os filhos da árvore.
   * Motivação: simular click em todos os nodos + load chields de forma recursiva.
   * Tem mais caráter de teste do que funcionalidade para a aplicação real
   * @returns 
   */
  public loadAll(): void {
    if (this.dados === undefined) { return; }
    this.dados.forEach(d => {
      this.loadChieldsAux(d);
    });
  }

  private loadChieldsAux(item: DataTree | undefined): void {
    if (item === undefined || item.id === undefined || item.jaClicado) { return; }
    item.isLoading = true;
    item.jaClicado = true;
    item.filhos = []; // evitar que filhos sejam re-adds

    // item.filhoAdicionado.subscribe(fadd => {
    //   this.loadChieldsAux(fadd);
    // });

    let filhos$: Observable<DataTree[] | undefined> | undefined = this.service.loadFilhos(item.id);
    if (filhos$ === null || filhos$ === undefined) {
      item.isLoading = false;
      return;
    }

    let subscriber = filhos$.subscribe(filhosData => {
      item.isLoading = false;
      if (filhosData === undefined) { subscriber.unsubscribe(); return; }
      filhosData.forEach(f => {
        item.addFilho(f, false);

        this.loadChieldsAux(f);

        // f.filhoAdicionado.subscribe(fadd => {
        //   this.loadChieldsAux(fadd);
        // });

        let idsSelecionados = this.getIdSelecionados();
        if (idsSelecionados !== undefined) { this.selecionarIds(idsSelecionados); }

      });
      item.aberto = true;
      subscriber.unsubscribe();
    });
  }
  //#endregion

  //#region controle selecionados
  /**
   * controla o estado dos itens selecionados, '_mapSelecionados'
   * @param item 
   * @returns 
   */
  private atualizarSelecionadosMem(item: DataTree | undefined): void {
    if (item === undefined || item.id === undefined) { return; }
    if (item.selecionado) {
      this._mapSelecionados.set(item.id, item);
    } else {
      if (this._mapSelecionados.has(item.id)) {
        this._mapSelecionados.delete(item.id);
      }
    }
    if (item.temFilhos() && item.filhos !== undefined) {
      item.filhos.forEach(f => this.atualizarSelecionadosMem(f));
    }
  }
  //#endregion

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
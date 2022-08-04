import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';

@Component({
  selector: 'app-componente-teste',
  templateUrl: './componente-teste.component.html',
  styleUrls: ['./componente-teste.component.css']
})
export class ComponenteTesteComponent implements OnInit, AfterContentChecked {

  @Input('ExibirCheckBox') ExibirCheckBox: boolean | undefined;
  @Input('MultiplaSelecao') MultiplaSelecao: boolean | undefined;

  //@Input('dados') dados: DataTree[] | undefined;
  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) {
    this._dados = Object.assign([], data);
    this.updateHasData();
  }
  get dados(): DataTree[] | undefined { return this._dados; }

  public hasData: boolean = false;

  constructor(private service: DadosArvoreService) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    // evitar o erro NG0100
    this.updateHasData();
  }

  public setData(data: DataTree[] | undefined, ajustarLoading: boolean = false): void {
    this.dados = Object.assign([], data);
    this.updateHasData();

    //if (this.dados !== undefined) { this.dados.forEach(d => this.limparSelecionadosEntrada(d)); }
    if (ajustarLoading && this.dados !== undefined) {
      this.ajustarLoadingJaClicado(this.dados);
    }
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

  public clickLabel(item: DataTree | undefined, selFilhos: boolean = false): void {
    if (item === undefined) { return; }
    item.aberto = true;
    this.loadAndSetFilhos(item);

    let isSelMem = item.selecionado;
    if (!this.MultiplaSelecao) { this.limparSelecao(); }
    item.selecionado = !isSelMem;

    if (this.MultiplaSelecao && selFilhos) {
      console.log('item.selecionarFilhos()');
      item.selecionarFilhos();
    }

  }

  //#region get selecionados
  public getMapSelecionados(): Map<string, DataTree> | undefined {
    if (this.dados === undefined) { return undefined; }
    return this.getMapSelecionadosAux(this.dados);
  }

  private getMapSelecionadosAux(data: DataTree[]): Map<string, DataTree> | undefined {
    let rt: Map<string, DataTree> | undefined = undefined;
    if (data === undefined || data.length <= 0) { return rt; }

    rt = new Map<string, DataTree>();
    data.forEach(d => {
      if (d === undefined) { return; }
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
    if (data === undefined || data.length <= 0) { return rt; }

    rt = [];
    data.forEach(d => {
      if (d === undefined) { return; }
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

  //#region aux selecionaritem.selecionado
  private limparSelecionadosEntrada(item: DataTree | undefined): void {
    // limpa qualquer pré-delecção de dados de entrada. A seleção é mantida por "selecionarFromService()"
    if (item === undefined) { return; }
    item.selecionado = false;
    if (item.temFilhos() && item.filhos !== undefined) {
      item.filhos.forEach(f => this.limparSelecionadosEntrada(f));
    }
  }

  public limparSelecao(): void {
    this.selecionarDados(this.dados, false);
  }

  public selecionarTodos(): void {
    if (!this.MultiplaSelecao) {
      console.info('Multipla seleção desabilitada');
      return;
    }
    this.selecionarDados(this.dados, true);
  }

  private selecionarDados(data: DataTree[] | undefined, selecionar: boolean): void {
    if (data === undefined || data.length <= 0) { return; }
    data.forEach(d => {
      if (d === undefined) { return; }
      d.selecionado = selecionar;
      if (!d.temFilhos() || d.filhos === undefined) { return; }
      this.selecionarDados(d.filhos, selecionar);
    });
  }

  public selecionarIds(ids: string[] | undefined, desmarcarDemais: boolean = false, selecionarFilhos: boolean = false): void {
    if (ids === undefined) { return; }
    if (desmarcarDemais) { this.limparSelecao(); }
    if (this.dados === undefined || ids === undefined || ids.length <= 0) { return; }
    if (!this.MultiplaSelecao) { ids = [ids[0]]; }
    this.selIdsAux(this.dados, ids, selecionarFilhos);
  }

  private selIdsAux(data: DataTree[] | undefined, ids: string[], selecionarFilhos: boolean = false): void {
    if (data === undefined || ids === undefined || ids.length <= 0) { return; }
    data.forEach(d => {
      if (d === undefined) { return; }
      if (ids.indexOf(d.id) >= 0) {
        d.selecionado = true;
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
      if (d.temFilhos() && d.filhos !== undefined) {
        this.setAllJaClicadoAux(d.filhos, jaClicado);
      }
    });
  }
  //#endregion

  //#region  Load Chields
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

    filhos$.subscribe(filhosData => {
      item.isLoading = false;
      if (filhosData === undefined) { return; }
      filhosData.forEach(f => {
        item.addFilho(f, false);
      });
      item.aberto = true;
    });
  }

  public loadAll(): void {
    if (this.dados === undefined) { return; }
    this.dados.forEach(d => {
      this.loadChieldsAux(d);
    });
  }

  private loadChieldsAux2(item: DataTree | undefined): void {
    if (item === undefined) { return; }

    this.service.loadFilhos(item.id)?.subscribe(filhos => {
      if (filhos === undefined) { return; }
      item.filhos = [];
      filhos.forEach(f => {
        if (f === undefined) { return; }
        item.addFilho(f, false);

        this.loadChieldsAux2(f);
      });
      // if (d.temFilhos() && d.filhos !== undefined) {
      //   d.filhos.forEach(f => {
      //     this.loadChieldsAux(d.filhos);
      //   });
      // }
    });
  }

  private loadChieldsAux(item: DataTree | undefined): void {
    if (item === undefined || item.id === undefined || item.jaClicado) { return; }
    item.isLoading = true;
    item.jaClicado = true;
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

        this.loadChieldsAux(f);
      });
      item.aberto = true;
    });
  }

  //#endregion

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
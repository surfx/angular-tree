import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';

import { DadosArvoreServiceService } from 'src/app/servicos/dados-arvore-service.service';

@Component({
  selector: 'app-arvore-simple-data',
  templateUrl: './arvore-simple-data.component.html',
  styleUrls: ['./arvore-simple-data.component.css']
})
export class ArvoreSimpleDataComponent implements OnInit, OnDestroy {

  // verificar o filtro e subloads
  // verificar items já marcados, antes e depois dos filtros / subloads
  // o controle de itens selecionados tem que ser feito dentro deste componente
  // o controle deve ser fino, ou seja, ao clicar e selecionar um item, o mesmo deve ir para 
  // um set de ids de itens selecionados, e ao ser deselecionado, removido do set
  // itens podem vir pré-selecionados através da propriedade 'dados' e da função 'setData'

  @Input('ExibirCheckBox') ExibirCheckBox: boolean | undefined;

  //@Input('dados') dados: DataTree[] | undefined;
  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) {
    this._dados = Object.assign([], data);
  }
  get dados(): DataTree[] | undefined { return this._dados; }

  private _subscriptions: Subscription[] = [];

  constructor(private service: DadosArvoreServiceService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this._subscriptions !== undefined && this._subscriptions.length > 0) {
      this._subscriptions.forEach(s => { if (s !== undefined) { s.unsubscribe(); } });
    }
  }

  public hasData(): boolean {
    return this.dados !== null && this.dados !== undefined && this.dados.length > 0;
  }

  public setData(data: DataTree[] | undefined, ajustarLoading: boolean = false): void {
    this.dados = Object.assign([], data);
    if (ajustarLoading && this.dados !== undefined) {
      this.ajustarLoadingJaClicado(this.dados);
    }
  }

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

  public clickLabel = (item: DataTree) => {
    if (!this.ok(item)) { return; }
    //item.selecionado = !item.selecionado;
    //console.log('click li: ', item);
    item.aberto = true;

    if (!item.jaClicado) { // evitar load excessivo
      item.isLoading = true;

      item.filhos = []; // evitar que filhos sejam re-adds

      // TODO: verificar filtros

      // apenas para simular o loading
      this.delay(300).then(any => {
        let filhos = this.loadData(item.id);
        item.isLoading = false;
        if (filhos !== null && filhos !== undefined && filhos.length > 0) {
          for (let i = 0; i < filhos.length; i++) {
            item.addFilho(filhos[i]);
          }
        }
        item.aberto = true;
      });

      // let filhos = this.loadData(item.id);
      // item.isLoading = false;
      // if (filhos !== null && filhos !== undefined && filhos.length > 0) {
      //   for (let i = 0; i < filhos.length; i++) {
      //     item.addFilho(filhos[i]);
      //   }
      // }
      // item.aberto = true;
    }

    //item.selecionado = true;
    item.jaClicado = true;
    //item.aberto = !item.aberto;

    //item.selecionarFilhos();
  }

  public checkValue(item: DataTree) {
    item.selecionado = !item.selecionado;
    item.selecionarFilhos();

    // não funciona (!) porque existem uma recursão de componentes aqui (!)
    console.log(this.dados);
    console.log('---------------------');
  }

  private loadData(id: string): DataTree[] | undefined {
    if (id === null || id === undefined) { return; }
    return this.service.loadFilhos(id);
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

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

  public limparSelecao(): void {
    this.selecionarDados(this.dados, false);
  }

  public selecionarTodos(): void {
    this.selecionarDados(this.dados, true);
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
    if (desmarcarDemais) { this.limparSelecao(); }
    if (!this.ok(this.dados) || !this.ok(ids) || ids.length <= 0) { return; }
    this.selIds(this.dados, ids, selecionarFilhos);
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

  public limparData(): void {
    this.dados = undefined;
  }

  public loadAll(): void {
    this.dados?.forEach(d => this.loadAllAux(d));
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
  }

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

  private ok = (el: any): boolean => el !== undefined && el !== null && el;

  public trackItem(index: number, item: DataTree) {
    return item.id;
  }

}
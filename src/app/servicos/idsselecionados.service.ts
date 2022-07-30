import { Injectable } from '@angular/core';
import { DataTree } from '../entidades/data-tree';


@Injectable({
  providedIn: 'root'
})
export class IdsSelecionadosService {

  private _idsSelecionados: Set<string> = new Set<string>();

  constructor() { }

  public getIdsSelecionados(): string[] | undefined {
    return [...this._idsSelecionados];
  }

  public addIdSelecionado(id: string): void {
    if (id === null || id === undefined || id.length <= 0) { return; }
    if (this._idsSelecionados === undefined || this._idsSelecionados === null) { this._idsSelecionados = new Set<string>(); }
    this._idsSelecionados.add(id);
  }

  public removerIdSelecionado(id: string): void {
    if (id === null || id === undefined || id.length <= 0) { return; }
    if (this._idsSelecionados === undefined || this._idsSelecionados === null) { return; }
    this._idsSelecionados.delete(id);
  }

  public clearData(): void {
    this._idsSelecionados.clear();
  }

  //--- auxiliares
  public auxIdsSelecionadosData(data: DataTree[] | undefined): void {
    if (data === null || data === undefined) { return; }
    data.forEach(d => this.auxIdsSelecionados(d));
  }
  public auxIdsSelecionados(item: DataTree | undefined): void {
    if (item === null || item === undefined) { return; }
    if (item.selecionado) {
      this.addIdSelecionado(item.id);
    } else {
      this.removerIdSelecionado(item.id);
    }
    if (item.temFilhos()) {
      item.filhos?.forEach(f => this.auxIdsSelecionados(f));
    }
    // item.filhoAdicionado.subscribe(fadd => {
    //   this.auxIdsSelecionados(fadd);
    // });
  }

  public isSelecionado(item: DataTree | undefined): boolean {
    if (item === undefined || this._idsSelecionados === undefined || this._idsSelecionados.size <= 0) { return false; }
    if (item.id === undefined || item.id === null || item.id.length <= 0) { return false; }
    return this._idsSelecionados.has(item.id);
  }

}
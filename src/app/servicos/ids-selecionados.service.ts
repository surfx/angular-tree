import { Injectable } from '@angular/core';
import { DataTree } from '../entidades/data-tree';
import { ItemSelecionado } from '../entidades/item-selecionado';

/**
 * @deprecated serviço deprecado
 */
@Injectable({
  providedIn: 'root'
})
export class IdsSelecionadosService {

  private _idsSelecionados: Map<string, ItemSelecionado> = new Map<string, ItemSelecionado>();

  constructor() { }

  public getIdsSelecionados(): string[] | undefined {
    return [...this._idsSelecionados.keys()];
  }

  public getItemsSelecionados(): ItemSelecionado[] | undefined {
    return [...this._idsSelecionados.values()];
  }

  public addIdSelecionado(id: string, texto: string): void {
    if (id === null || id === undefined || id.length <= 0) { return; }
    if (this._idsSelecionados === undefined || this._idsSelecionados === null) { this._idsSelecionados = new Map<string, ItemSelecionado>(); }
    this._idsSelecionados.set(id, new ItemSelecionado(id, texto));
  }

  public addItemSelecionado(item: ItemSelecionado): void {
    if (item === null || item === undefined || item.id === undefined || item.id.length <= 0) { return; }
    if (this._idsSelecionados === undefined || this._idsSelecionados === null) { this._idsSelecionados = new Map<string, ItemSelecionado>(); }
    this._idsSelecionados.set(item.id, item);
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
      this.addIdSelecionado(item.id, item.texto);
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

  // public isSelecionado(item: DataTree | undefined): boolean {
  //   if (item === undefined || this._idsSelecionados === undefined || this._idsSelecionados.size <= 0) { return false; }
  //   if (item.id === undefined || item.id === null || item.id.length <= 0) { return false; }
  //   return this._idsSelecionados.has(item.id);
  // }

}
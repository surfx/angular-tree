import { Injectable } from '@angular/core';


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

}

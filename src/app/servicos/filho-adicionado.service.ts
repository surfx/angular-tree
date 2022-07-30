import { EventEmitter, Injectable, Output } from '@angular/core';
import { DataTree } from '../entidades/data-tree';

@Injectable({
  providedIn: 'root'
})
export class FilhoAdicionadoService {

  @Output() filhoAdicionadoEvent: EventEmitter<DataTree> = new EventEmitter<DataTree>();

  constructor() { }

  public emitir(filho: DataTree): void {
    if (this.filhoAdicionadoEvent === undefined || filho === undefined) { return; }
    this.filhoAdicionadoEvent.emit(filho);
  }

}
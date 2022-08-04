import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { DataTree } from 'src/app/entidades/data-tree';

@Component({
  selector: 'app-componente-teste',
  templateUrl: './componente-teste.component.html',
  styleUrls: ['./componente-teste.component.css']
})
export class ComponenteTesteComponent implements OnInit, AfterContentChecked {

  //@Input('dados') dados: DataTree[] | undefined;
  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) {
    this._dados = Object.assign([], data);
    this.updateHasData();
  }
  get dados(): DataTree[] | undefined { return this._dados; }

  public hasData: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    // evitar o erro NG0100
    this.updateHasData();
  }

  public setData(data: DataTree[] | undefined, ajustarLoading: boolean = false): void {
    this.dados = Object.assign([], data);
    this.updateHasData();

    // if (this.dados !== undefined) { this.dados.forEach(d => this.limparSelecionadosEntrada(d)); }
    // if (ajustarLoading && this.dados !== undefined) {
    //   this.ajustarLoadingJaClicado(this.dados);
    // }

    // this.selecionarFromService();
  }

  private updateHasData(): void {
    this.hasData = this.dados !== null && this.dados !== undefined && this.dados.length > 0;
  }

}
import { Component, Input, OnInit } from '@angular/core';
import { DataTree } from 'src/app/entidades/data-tree';
import { ArvoreUtil } from 'src/app/util/arvore-util';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit {

  private _arvoreUtil: ArvoreUtil = new ArvoreUtil();

  private _dados: DataTree[] | undefined = undefined;
  @Input('dados')
  set dados(data: DataTree[] | undefined) { this._dados = Object.assign([], data); }
  get dados(): DataTree[] | undefined { return this._dados; }

  constructor() {

  }

  ngOnInit(): void {
    this._dados = [
      new DataTree('1', 'item 1'),
      new DataTree('2', 'item 2')
    ];
  }

  // {
  //   id: '1', text: 'item 1', chields: [
  //     { id: '1.1', text: 'item 1.1' },
  //     { id: '1.2', text: 'item 1.2' },
  //     { id: '1.3', text: 'item 1.3' }
  //   ]
  // },


  public testeArvoreRandomica(): void {
    let arvore = this._arvoreUtil.getArvoreRandomica();
    console.table(arvore);
  }

  public testeArvoreJsonRandomica(): void {
    let arvore = this._arvoreUtil.getArvoreJsonRandomica();
    console.log(arvore);
    let c = ArvoreUtil.convertJsonToDataTree(arvore);
    console.log(c);
  }

  public testeAddFilho(): void {

    if (this._dados !== undefined && this._dados[0] !== undefined) {
      this._dados[0].addFilho(new DataTree('f1', 'Filho 1'), false);
    }


    this.delay(300).then(any => {
      if (this._dados !== undefined && this._dados[0] !== undefined) {
        console.log(this._dados[0].filhos?.toString());
      }
    });
  }



  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
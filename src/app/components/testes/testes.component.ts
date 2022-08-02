import { Component, OnInit } from '@angular/core';
import { DataTree } from 'src/app/entidades/data-tree';
import { Util } from 'src/app/util/util';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit {

  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";

  constructor() {
    this.possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  }

  ngOnInit(): void {
  }

  // {
  //   id: '1', text: 'item 1', chields: [
  //     { id: '1.1', text: 'item 1.1' },
  //     { id: '1.2', text: 'item 1.2' },
  //     { id: '1.3', text: 'item 1.3' }
  //   ]
  // },


  public randomTest() {
    let text = Util.getRandomText(30, this.possible);
    console.log(text);
  }

  public testeArvoreRandomica(): void {
    let arvore = this.gerarArvoreRandomica(0);
    console.table(arvore);
  }

  public testeArvoreJsonRandomica(): void {
    let arvore = this.gerarArvoreJsonRandomica(0);
    console.log(arvore);
    let c = this.convert(arvore);
    console.log(c);
  }

  //----------------------------------

  public gerarArvoreRandomica(passo: number = 0, maxStack = 4): DataTree[] {
    if (passo >= maxStack) { return []; }
    let rt: DataTree[] = [];

    let numNodos = Util.getRandomInt(3, 15);
    for (let i = 0; i < numNodos; i++) {
      let dtTree = new DataTree(Util.getRandomInt(1, 1500) + '', Util.getRandomText(30, this.possible));
      if (!Util.getRandomBoolean()) { rt.push(dtTree); continue; }
      let filhosAux = this.gerarArvoreRandomica(passo + 1, maxStack);
      if (filhosAux.length > 0) {
        filhosAux.forEach(fadd => dtTree.addFilho(fadd, false));
      }
      rt.push(dtTree);
    }
    return rt;
  }

  public gerarArvoreJsonRandomica(passo: number = 0, maxStack = 4): any[] | undefined {
    if (passo >= maxStack) { return undefined; }
    let rt: any[] | undefined = [];

    let numNodos = Util.getRandomInt(3, 15);
    for (let i = 0; i < numNodos; i++) {
      let dtTree: any = { id: Util.getRandomInt(1, 1500) + '', text: Util.getRandomText(30, this.possible), chields: undefined };
      if (!Util.getRandomBoolean()) { rt.push(dtTree); continue; }
      let filhosAux = this.gerarArvoreJsonRandomica(passo + 1, maxStack);
      if (filhosAux !== undefined && filhosAux.length > 0) {
        dtTree.chields = filhosAux;
      }
      rt.push(dtTree);
    }

    return rt;
  }

  private convert(json: any[] | undefined): DataTree[] | undefined {
    if (json === undefined) { return undefined; }
    let ok = (obj: any) => obj !== undefined && obj !== null;
    if (!ok(json) || json.length <= 0) { return undefined; }
    let rt: DataTree[] = [];

    for (let i = 0; i < json.length; i++) {
      let j = json[i];
      if (!ok(j) || !ok(j.id) || !ok(j.text)) { continue; }
      let d: DataTree = new DataTree(j.id + '', j.text);
      if (ok(j.chields)) {
        let aux = this.convert(j.chields);
        if (ok(aux) && aux !== undefined && aux?.length > 0) {
          for (let y = 0; y < aux.length; y++) {
            d.addFilho(aux[y], false);
          }
        }
      }
      rt.push(d);
    };

    return rt;
  }


}
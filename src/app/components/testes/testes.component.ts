import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { ArvoreUtil } from 'src/app/util/arvore-util';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements AfterViewInit, OnInit {

  data$: Observable<DataTree[] | undefined> | undefined;
  alldata: DataTree[] | undefined;

  constructor(
    private service: DadosArvoreService
  ) {
    this.data$ = this.service.getInitialData();
    let subscriber = this.service.getData()?.subscribe(dados => { this.alldata = dados; subscriber?.unsubscribe(); });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

  //---------------------

  private getData1(): DataTree[] {
    let rt: DataTree[] = [];

    let item1: DataTree = new DataTree("1", "item 1");
    let item11: DataTree = new DataTree("1.1", "item 1.1");
    let item2: DataTree = new DataTree("2", "item 2");
    let item21: DataTree = new DataTree("2.1", "item 2.1");
    item1.addFilho(item11, false);
    item2.addFilho(item21, false);

    let item111: DataTree = new DataTree("1.1.1", "item 1.1.1");
    item11.addFilho(item111, false);
    let item11a: DataTree = new DataTree("1.1.a", "item 1.1.a");
    item11.addFilho(item11a, false);

    let item4: DataTree = new DataTree("4", "item 4");

    rt.push(item1);
    rt.push(item2);
    rt.push(item4);
    return rt;
  }

  private getData2(): DataTree[] {
    let rt: DataTree[] = [];

    let item1: DataTree = new DataTree("1", "item 1");
    let item11: DataTree = new DataTree("1.1", "item 1.1");

    let item2: DataTree = new DataTree("2", "item 2");
    let item21: DataTree = new DataTree("2.1", "item 2.1");
    let item22: DataTree = new DataTree("2.2", "item 2.2");
    let item221: DataTree = new DataTree("2.2.1", "item 2.2.1");
    let item222: DataTree = new DataTree("2.2.2", "item 2.2.2");

    let item3: DataTree = new DataTree("3", "item 3");

    item22.addFilho(item221, false);
    item22.addFilho(item222, false);

    item1.addFilho(item11, false);
    item2.addFilho(item21, false);
    item2.addFilho(item22, false);

    rt.push(item1);
    rt.push(item2);
    rt.push(item3);
    return rt;
  }

  public teste1(): void {
    let dt1 = this.getData1();
    let dt2 = this.getData2();
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');
    ArvoreUtil.printDt(dt2);
    console.log('-------------------');


    // let m: Map<string, DataTree> | undefined = this.toMapDt(dt2);
    // if (m === undefined) { return; }
    // m.forEach((v, k) => { console.log(k, v); });
    // console.log('-------------------');

    //let dt3: DataTree[] | undefined = this.mergeDt(dt1, m);
    // this.merge2(dtTestesComponent1, dt2);
    // this.printDt(dt1);

    // let aux: DataTree[] | undefined = this.mteste(dt1, dt2);
    // console.log(aux);

    // let vid1 = [...dt1.map(item => item.id)];
    // let vid2 = [...dt2.map(item => item.id)];
    // let dt3 = dt2.filter(v => vid1.indexOf(v.id) < 0); // itens que existem no vetor 2, mas não no vetor 1
    // let dt4 = dt1.filter(v => vid2.indexOf(v.id) < 0); // itens que existem no vetor 1, mas não no vetor 2
    // console.log(dt3);
    // console.log(dt4);

    // let teste = ArvoreUtil.mergeDt(dt1, dt2);
    // console.log(teste);
    // ArvoreUtil.printDt(teste);

  }


  public teste2(): void {

    let a1: DataTree[] = [
      new DataTree('1', 'item 1'),
      new DataTree('2', 'item 2'),
      new DataTree('4', 'item 4')
    ];
    let a2: DataTree[] = [
      new DataTree('1', 'item 1'),
      new DataTree('2', 'item 2'),
      new DataTree('3', 'item 3')
    ];

    // let a3 = [...a1, ...a2];
    // let a4 = a1.concat(a2);
    // console.log(a3);
    // console.log(a4);

    //----------------------
    // const mergeById = (array1: DataTree[], array2: DataTree[]) =>
    //   array1.map(itm => ({
    //     ...array2.find((item) => (item.id === itm.id) && item),
    //     ...itm
    //   }));
    // let result = mergeById(a1, a2);
    // console.log(result);

    // const merged = a2.reduce((arr, item) => {
    //   arr.push(item);
    //   return arr;
    // }, a1);
    // console.log(merged);
    //----------------------

    // let teste = ArvoreUtil.mergeDt(a1, a2);
    // console.log(teste);
  }

  public teste3(): void {
    let au: ArvoreUtil = new ArvoreUtil();
    let a1 = au.getArvoreRandomica(3);
    let a2 = au.getArvoreRandomica(2);

    console.log(a1);
    ArvoreUtil.printDt(a1);
    console.log('----------------------------');
    console.log(a2);
    ArvoreUtil.printDt(a2);
    console.log('----------------------------');

    // let teste = ArvoreUtil.mergeDt(a1, a2);
    // console.log(teste);
    // ArvoreUtil.printDt(teste);
  }

  public teste5(): void {
    // busca árvore recursiva
    ArvoreUtil.printDt(this.alldata);
    console.log('-------------------');

    let filtro: string = "";
    let a1 = ArvoreUtil.findSubTree(this.alldata, filtro);
    ArvoreUtil.printDt(a1);
  }

  public teste4(): void {
    let dt1 = this.getData1();
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');

    let itemAddFilho: DataTree = new DataTree("1.1", "item 1.1");
    for (let i = 0; i < 3; i++) {
      itemAddFilho.addFilho(new DataTree("1.1." + i, "item 1.1." + i));
    }
    ArvoreUtil.printDt([itemAddFilho]);
    console.log('-------------------');

    this.atualizarFilhos(dt1, itemAddFilho);
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');

    //--- mais update de filhos
    let item11a: DataTree = new DataTree("1.1.a", "item 1.1.a");
    for (let i = 0; i < 5; i++) {
      item11a.addFilho(new DataTree("1.1.a." + i, "1.1.a." + i));
    }
    this.atualizarFilhos(dt1, item11a);
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');

    //--- mais update de filhos
    //1.1.a.2
    let item11a2: DataTree = new DataTree("1.1.a.2", "item 1.1.a.2");
    for (let i = 0; i < 5; i++) {
      item11a2.addFilho(new DataTree("1.1.a.2." + i, "1.1.a.2." + i));
    }
    this.atualizarFilhos(dt1, item11a2);
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');
  }

  /**
     * atualiza a estrutura de árvore caso algum filho tenha sido alterado
     * @param dados 
     * @param itemAtualizado 
     * @returns 
     */
  private atualizarFilhos(dados: DataTree[] | undefined, itemAtualizado: DataTree | undefined): boolean {
    if (dados === undefined || itemAtualizado === undefined) { return false; }
    for (let i = 0; i < dados.length; i++) {
      if (dados[i].id === itemAtualizado.id) {
        itemAtualizado.filhos = ArvoreUtil.mergeDt(dados[i].filhos, itemAtualizado.filhos);
        dados[i] = itemAtualizado;
        return true;
      }
    }
    // busca filhos
    for (let i = 0; i < dados.length; i++) {
      if (dados[i] === undefined || !dados[i].temFilhos() || dados[i].filhos === undefined) { continue; }
      if (this.atualizarFilhos(dados[i].filhos, itemAtualizado)) {
        return true;
      }
    }
    return false;
  }

  // 1) encontrar o nodo na árvore (id)
  // 2) realizar um merge dos filhos e subfilhos
  // 2.1) merge de filhos = unir todos os filhos em um vetor só
  // 2.2) merge de subfilhos = para cada subfilho, fazer um merge dos arrays dos filhos

  private testemergearray() {
    let array1: DataTree[] = [new DataTree('1', "raju"), new DataTree('2', "ravi"), new DataTree('4', "john"), new DataTree('6', "jack")];
    let array2: DataTree[] = [new DataTree('1', "b.com"), new DataTree('3', "b.a"), new DataTree('4', "c.a"), new DataTree('5', "horticulture")];

    ArvoreUtil.printDt(array1, true);
    console.log('-------------------');
    ArvoreUtil.printDt(array2, true);
    console.log('-------------------');

    let vids1 = [...array1.map(item => item.id)];
    let array2diff = array2.filter(item => vids1.indexOf(item.id) < 0); // itens que existem no vetor 2, mas não no vetor 1
    let arrayMerge = [...array1, ...array2diff];
    ArvoreUtil.printDt(arrayMerge, true);
    console.log('-------------------');

  }

  public teste6(): void {
    let a1: DataTree[] = [
      new DataTree('1', 'item 1'),
      new DataTree('2', 'item 2'),
      new DataTree('4', 'item 4')
    ];
    let a2: DataTree[] = [
      new DataTree('7', 'item 7'),
      new DataTree('1', 'item 1'),
      new DataTree('2', 'item 2'),
      new DataTree('3', 'item 3')
    ];

    ArvoreUtil.printDt(a1, true);
    console.log('-------------------');
    ArvoreUtil.printDt(a2, true);
    console.log('-------------------');

    let arrayMerged = this.mergearray(a1, a2);
    ArvoreUtil.printDt(arrayMerged, true);
    console.log('-------------------');

    console.log('******************************');

    let dt1 = this.getData1();
    let dt2 = this.getData2();
    ArvoreUtil.printDt(dt1);
    console.log('-------------------');
    ArvoreUtil.printDt(dt2);
    console.log('-------------------');
    //arrayMerged = this.mergearray(dt1, dt2);
    // arrayMerged = ArvoreUtil.mergeDt(dt1, dt2);
    // ArvoreUtil.printDt(arrayMerged);
  }

  private mergearray(a1: DataTree[] | undefined, a2: DataTree[] | undefined): DataTree[] | undefined {
    if (a1 === undefined || a2 === undefined) { return a1 ?? a2; }
    let rt: DataTree[] = [];

    let idsA1 = a1.map(item => item.id);
    let diff: DataTree[] = a2.filter(item => idsA1.indexOf(item.id) < 0);

    a1.forEach(itemA1 => {
      console.log('itemA1', itemA1);
      let itemA2: DataTree | undefined = a2.find(item => item.id === itemA1.id);
      if (itemA2 === undefined) {
        rt.push(itemA1);
        return;
      }
      let f: DataTree[] | undefined = this.mergearray(itemA1.filhos, itemA2.filhos);
      itemA1.filhos = f;
      rt.push(itemA1);
    });
    if (diff.length > 0) { diff.forEach(item => rt.push(item)); }

    return rt;
  }

  public itemDataTree: DataTree = new DataTree('001', 'item 001');

  public teste7(): void {
    this.itemDataTree.selecionado = !this.itemDataTree.selecionado;
    console.log(this.itemDataTree);
  }

  public clickLabel(item: DataTree | undefined, selFilhos: boolean = false): void {
    console.log('clickLabel: ', item);
  }

}
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataTree } from 'src/app/entidades/data-tree';
import { DadosArvoreService } from 'src/app/servicos/dados-arvore.service';
import { ArvoreUtil } from 'src/app/util/arvore-util';
import { ArvoreSimpleDataComponent } from '../arvore-simple-data/arvore-simple-data.component';
import { ComponenteTesteComponent } from './componente-teste/componente-teste.component';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.css']
})
export class TestesComponent implements OnInit, AfterViewInit {

  @ViewChild('componente_teste') componente_teste: ComponenteTesteComponent | undefined;
  @ViewChild('tree_simple') treeSimple: ArvoreSimpleDataComponent | undefined;

  private _arvoreUtil: ArvoreUtil = new ArvoreUtil();

  private _dados: DataTree[] | undefined = undefined;

  data$: Observable<DataTree[] | undefined> | undefined;

  constructor(private service: DadosArvoreService) {
    this.data$ = this.service.getInitialData();
  }

  ngOnInit(): void {
    //this._dados = this._arvoreUtil.getArvoreRandomica();
    //this._dados = ArvoreUtil.convertJsonToDataTree(this.getJsonDataTeste2());

    //this.service.
  }

  ngAfterViewInit(): void {
    this.data$?.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data);
    });

    this.delay(30).then(any => {
      if (this.componente_teste !== undefined) {
        //this.componente_teste.dados = this._dados;
        this.componente_teste.setData(this._dados);
      }
    });
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
    if (this.componente_teste === undefined) { return; }

    let data = this.componente_teste.dados;

    if (data === undefined) { return; }

    // let filhosAux = Object.assign([], data[0].filhos);
    // filhosAux?.push(new DataTree('f1', 'Filho 1'));
    //data[0].filhos = filhosAux;

    data[0].addFilho(new DataTree('f1', 'Filho 1'), false);

    console.log(data[0].filhos?.toString());

    this.delay(300).then(any => {
      if (data !== undefined && data[0] !== undefined) {
        console.log(data[0].filhos?.toString());
      }
    });

    this.delay(400).then(any => {
      if (this.componente_teste === undefined) { return; }
      if (this.componente_teste.dados === undefined) { return; }
      if (this.componente_teste.dados[0] === undefined) { return; }
      console.log(this.componente_teste.dados[0].filhos);
    });
  }

  public testeAddFilho2(): void {
    if (this.treeSimple === undefined || this.treeSimple.dados === undefined) { return; }

    if (this.treeSimple.dados !== undefined) {
      this.treeSimple.dados.forEach(d => {
        this.loadChieldsAux2(d);
      });
    }
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

  public testeAddFilho3(): void {
    if (this.treeSimple === undefined) { return; }
    this.treeSimple.loadAll();
  }

  private getJsonDataTeste2() {
    return [
      {
        id: '1', text: 'GOVERNOS ESTADUAIS', chields: [
          { id: '1.1', text: 'Governo do Estado de Acre - AC' },
        ]
      },
      {
        id: '2', text: 'Governo do Estado de Alagoas', chields: [
          { id: '2.1', text: 'Secretaria de Segurança Pública da Defesa Social de Alagoas' },
        ]
      },
      {
        id: '3', text: 'Governo do Estado de Amazonas'
      },
    ];
  }

  public loadInitialData(): void {
    let obs$ = this.service.getInitialData();
    if (obs$ === undefined) { return; }
    obs$.subscribe(data => {
      if (data === undefined) { return; }
      this.treeSimple?.setData(data, true);
    });
  }

  //this.delay(300).then(any => {});
  async delay(ms: number) { await new Promise<void>(resolve => setTimeout(() => resolve(), ms)); }

}
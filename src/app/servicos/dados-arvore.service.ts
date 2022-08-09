import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { DataTree } from '../entidades/data-tree';
import { ArvoreUtil } from '../util/arvore-util';

@Injectable({
  providedIn: 'root'
})
export class DadosArvoreService {

  // apenas para simular um delay -> consulta a base de dados / service
  private _delayService: number = 200;

  private jsonData;

  constructor() {
    //this.jsonData = this.getJsonDataTeste0();
    //this.jsonData = this.getJsonDataTeste1();
    this.jsonData = this.getJsonDataTeste2();
    //this.jsonData = this.gerarArvoreJsonRandomica();
  }

  //#endregion data base simulada
  private getJsonDataTeste0() {
    return [
      {
        id: '1', text: 'item 1', children: [
          {
            id: '1.1', text: 'item 1.1', children: [
              { id: '2.1', text: 'item 2.1' },
              { id: '2.2', text: 'item 2.2', children: [
                { id: '3.2.1.1', text: 'item 3.2.1.1' },
                { id: '3.2.2.1', text: 'item 3.2.2.1' }
              ] }
            ]
          },
          { id: '1.2', text: 'item 1.2' },
          { id: '1.3', text: 'item 1.3' }
        ]
      }
    ];
  }

  private getJsonDataTeste1() {
    return [
      {
        id: '1', text: 'item 1', children: [
          { id: '1.1', text: 'item 1.1' },
          { id: '1.2', text: 'item 1.2' },
          { id: '1.3', text: 'item 1.3' }
        ]
      },
      {
        id: '2', text: 'item 2', children: [
          { id: '2.1', text: 'item 2.1' },
          { id: '2.2', text: 'item 2.2' }
        ]
      },
      {
        id: '3', text: 'item 3', children: [
          { id: '3.1', text: 'item 3.1' },
          {
            id: '3.2', text: 'item 3.2', children: [
              {
                id: '3.2.1', text: 'item 3.2.1', children: [
                  { id: '3.2.1.1', text: 'item 3.2.1.1' },
                  { id: '3.2.2.1', text: 'item 3.2.2.1' }
                ]
              },
              { id: '3.2.2', text: 'item 3.2.2' }
            ]
          },
          { id: '3.3', text: 'item 3.3' },
          { id: '3.4', text: 'item 3.4' }
        ]
      },
    ];
  }

  private getJsonDataTeste2() {
    return [
      {
        id: '1', text: 'GOVERNOS ESTADUAIS', children: [
          {
            id: '1.1', text: 'Governo do Estado de Acre - AC', children: [
              {
                id: '1.1.1', text: 'Secretaria de Segurança Pública do Acre', children: [
                  {
                    id: '1.1.1.1', text: 'Polícia Militar do Acre', children: [
                      { id: '1.1.1.1.1', text: 'TESTE' }
                    ]
                  }
                ]
              }
            ]
          },
          { id: '1.2', text: 'Corpo de Bombeiros Militar do Acre' },
          { id: '1.3', text: '100 Dp Teste Teste' },
          { id: '1.4', text: '101 Dp Teste' },
          { id: '1.5', text: '102 Dpt' },
          { id: '1.6', text: 'Teste Acrea' },
          { id: '1.7', text: 'Delegacia Virtual do Acre' },
          { id: '1.8', text: '109 Dp Teste' },
          { id: '1.9', text: '1º Distrito Policial - Teste Intbo' }
        ]
      },
      {
        id: '2', text: 'Governo do Estado de Alagoas', children: [
          {
            id: '2.1', text: 'Secretaria de Segurança Pública da Defesa Social de Alagoas', children: [
              { id: '2.1.1', text: 'Polícia Militar de Alagoas' },
              { id: '2.1.2', text: 'Corpo de Bombeiros Militar de Alagoas' },
              { id: '2.1.3', text: 'Polícia Civil de Alagoas' },
            ]
          },
          {
            id: '2.2', text: 'Governo do Estado de Amapá', children: [
              {
                id: '2.2.1', text: 'Secretaria de Segurança Pública da Justiça e Segurança Pública do Amapá', children: [
                  { id: '2.2.1.1', text: 'Polícia Militar do Amapá' },
                  { id: '2.2.1.2', text: 'Corpo de Bombeiros Militar do Amapá' },
                  {
                    id: '2.2.1.3', text: 'Polícia Civil do Amapá', children: [
                      { id: '2.2.1.3.1', text: '1 DP' },
                      { id: '2.2.1.3.2', text: '2 DP' },
                      { id: '2.2.1.3.3', text: 'Distrito Policial - Intbo - Teste' }
                    ]
                  },
                ]
              },
            ]
          }
        ]
      },
      {
        id: '3', text: 'Governo do Estado de Amazonas', children: [
          {
            id: '3.1', text: 'Secretaria de Segurança Pública do Amazonas', children: [
              { id: '3.1.1', text: 'Polícia Militar do Amazonas' },
              { id: '3.1.2', text: 'Corpo de Bombeiros Militar do Amazonas' },
              {
                id: '3.1.3', text: 'Polícia Civil do Amazonas', children: [
                  { id: '3.1.3.1', text: '1º Distrito Policial - Manaus' }
                ]
              }
            ]
          },
          {
            id: '3.2', text: 'Governo do Estado de Bahia', children: [
              {
                id: '3.2.1', text: 'Secretaria de Segurança Pública de Bahia', children: [
                  { id: '3.2.1.1', text: 'Polícia Militar da Bahia' },
                  { id: '3.2.1.2', text: 'Corpo de Bombeiros Militar da Bahia' },
                  { id: '3.2.1.3', text: 'Polícia Civil da Bahia' }
                ]
              },
              {
                id: '3.2.2', text: 'Governo do Estado de Ceará', children: [
                  {
                    id: '3.2.2.1', text: 'Secretaria de Segurança Pública da e Defesa Social do Ceará', children: [
                      { id: '3.2.2.1.1', text: 'Polícia Militar do Ceará' },
                      { id: '3.2.2.1.2', text: 'Corpo de Bombeiros Militar do Ceará' },
                      { id: '3.2.2.1.3', text: 'Polícia Civil do Ceará' }
                    ]
                  },
                ]
              }
            ]
          },
          {
            id: '3.3', text: 'Governo do Distrito Federal', children: [
              {
                id: '3.3.1', text: 'Secretaria de Estado de Segurança Pública e Defesa Social do Distrito Federal', children: [
                  {
                    id: '3.3.1.1', text: 'Polícia Militar do Distrito Federal', children: [
                      { id: '3.3.1.1.1', text: 'Guarda Municipal' }
                    ]
                  },
                  { id: '3.3.1.2', text: 'Corpo de Bombeiros Militar do Distrito Federal' },
                  {
                    id: '3.3.1.3', text: 'Polícia Civil do Distrito Federal', children: [
                      { id: '3.3.1.3.1', text: '1º Distrito Policial' }
                    ]
                  },
                  { id: '3.3.1.4', text: 'Teste EO' },
                ]
              },
              { id: '3.3.2', text: 'Teste' }
            ]
          },
          {
            id: '3.4', text: 'Governo do Estado de Espírito Santo', children: [
              {
                id: '3.4.1', text: 'Secretaria de Segurança Pública e Defesa Social do Espírito Santo', children: [
                  { id: '3.4.1.1', text: 'Polícia Militar do Espírito Santo' },
                  { id: '3.4.1.2', text: 'Corpo de Bombeiros Militar do Espírito Santo' },
                  { id: '3.4.1.3', text: 'Polícia Civil do Espírito Santo' }
                ]
              }
            ]
          }
        ]
      },
    ];
  }

  private _arvoreUtil: ArvoreUtil = new ArvoreUtil();
  private gerarArvoreJsonRandomica() {
    return this._arvoreUtil.getArvoreJsonRandomica();
  }

  public getData(): Observable<DataTree[] | undefined> | undefined {
    if (this.jsonData === undefined) { return undefined; }
    let rt$ = of(this.jsonData);
    return (
      this._delayService <= 0 ? rt$ : rt$.pipe(delay(this._delayService))
    ).pipe(map(json => ArvoreUtil.convertJsonToDataTree(json)));
  }
  //#endregion

  // nós iniciais da árvore, sem filhos
  public getInitialData(): Observable<DataTree[] | undefined> | undefined {
    // TODO: corrigir para usar o Observable
    let dadosAux: DataTree[] | undefined = ArvoreUtil.convertJsonToDataTree(this.jsonData); //this.getData();
    if (dadosAux === undefined) { return undefined; }

    let rt: DataTree[] = [];
    dadosAux.forEach(d => {
      if (d === undefined || d === null) { return; }
      rt.push(new DataTree(d.id, d.texto)); // suprimir os filhos (para teste)
    });
    return this._delayService <= 0 ? of(rt) : of(rt).pipe(delay(this._delayService));
  }

  // para o exemplo não vou retornar os subfilhos
  public loadFilhos(id: string): Observable<DataTree[] | undefined> | undefined {
    // TODO: corrigir para usar o Observable
    let dadosAux: DataTree[] | undefined = ArvoreUtil.convertJsonToDataTree(this.jsonData); // base de dados
    if (id === null || id === undefined || dadosAux === undefined) { return undefined; }
    let rt = this.loadFilhosAux(id, dadosAux);
    return this._delayService <= 0 ? of(rt) : of(rt).pipe(delay(this._delayService));
  }

  private loadFilhosAux(id: string, data: DataTree[]): DataTree[] | undefined {
    if (id === null || id === undefined || data === null || data === undefined) { return undefined; }

    let rt: DataTree[] = [];
    data.forEach(d => {
      if (rt.length > 0) {
        return;
      }
      if (d === undefined || d.filhos == undefined) { return; }
      d.selecionado = false;
      if (d.id === id) {
        d.filhos.forEach(f => rt?.push(new DataTree(f.id, f.texto))); // suprimir os filhos (para teste)
        return;
      }

      if (rt.length > 0) {
        return;
      }

      let aux = this.loadFilhosAux(id, d.filhos);
      if (aux) {
        // suprimir os filhos (para teste)
        aux.forEach(a => {
          a.selecionado = false;
          rt?.push(new DataTree(a.id, a.texto));
        }
        );
      }
    });

    return rt;
  }



  // --------------- filtrarData ---------------
  public filtrarData(filtro: string): Observable<DataTree[] | undefined> | undefined {
    // TODO: corrigir para usar o Observable
    let rt = this.filtrarDataAux(ArvoreUtil.convertJsonToDataTree(this.jsonData), filtro);
    return this._delayService <= 0 ? of(rt) : of(rt).pipe(delay(this._delayService));
  }

  private filtrarDataAux(data: DataTree[] | undefined, filtro: string): DataTree[] | undefined {
    if (data === null || data === undefined || !data || data.length <= 0) { return undefined; }
    if (filtro === null || filtro === undefined || filtro.length <= 0) { return data; }
    let rt: DataTree[] = [];
    filtro = filtro.trim().toLowerCase();

    data.forEach(d => {
      if (d === null || d === undefined) { return; }
      // se o próprio elemento não tiver ou filtro, ou algum de seus filhos
      // this.contemFiltro - se algum filho tiver o filtro
      if (d.texto.trim().toLowerCase().indexOf(filtro) < 0 && !this.contemFiltro(d.filhos, filtro)) {
        return;
      }
      let addDados: DataTree = new DataTree(d.id, d.texto);
      // addDados.jaClicado = d.jaClicado;
      // verifica cada filho de 'd', para ver se ele deve ser adicionado ao retorno
      if (d.temFilhos() && d.filhos) {
        let auxFilhos: DataTree[] | undefined = this.filtrarDataAux(d.filhos, filtro);
        if (auxFilhos !== undefined) {
          auxFilhos.forEach(filho => {
            if (addDados.filhos === undefined || addDados.filhos === null) {
              addDados.filhos = [];
            }
            addDados.filhos.push(filho);
          });
        }
      }
      rt.push(addDados);

    });

    return rt;
  }


  private contemFiltro(data: DataTree[] | undefined, filtro: string): boolean {
    if (data === null || data === undefined || !data || data.length <= 0) { return false; }
    if (filtro === null || filtro === undefined || filtro.length <= 0) { return false; }
    filtro = filtro.trim().toLowerCase();
    for (let i = 0; i < data.length; i++) {
      let d: DataTree = data[i];
      if (d === null || d === undefined) { continue; }
      if (d.texto.trim().toLowerCase().indexOf(filtro) >= 0) {
        return true;
      }
      if (d.temFilhos() && this.contemFiltro(d.filhos, filtro)) {
        return true;
      }
    }
    return false;
  }
  // # End --------------- filtrarData ---------------

}
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DataTree } from '../entidades/data-tree';
import { Util } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class DadosArvoreService {

  // apenas para simular um delay -> consulta a base de dados / service
  private _delayService: number = 200;

  private jsonData;

  constructor() {
    //this.jsonData = this.getJsonDataTeste2();
    this.jsonData = this.gerarArvoreJsonRandomica();
  }

  private getJsonDataTeste1() {
    return [
      {
        id: '1', text: 'item 1', chields: [
          { id: '1.1', text: 'item 1.1' },
          { id: '1.2', text: 'item 1.2' },
          { id: '1.3', text: 'item 1.3' }
        ]
      },
      {
        id: '2', text: 'item 2', chields: [
          { id: '2.1', text: 'item 2.1' },
          { id: '2.2', text: 'item 2.2' }
        ]
      },
      {
        id: '3', text: 'item 3', chields: [
          { id: '3.1', text: 'item 3.1' },
          {
            id: '3.2', text: 'item 3.2', chields: [
              {
                id: '3.2.1', text: 'item 3.2.1', chields: [
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
        id: '1', text: 'GOVERNOS ESTADUAIS', chields: [
          {
            id: '1.1', text: 'Governo do Estado de Acre - AC', chields: [
              {
                id: '1.1.1', text: 'Secretaria de Segurança Pública do Acre', chields: [
                  {
                    id: '1.1.1.1', text: 'Polícia Militar do Acre', chields: [
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
          { id: '1.7', text: '109 Dp Teste' },
          { id: '1.7', text: '1º Distrito Policial - Teste Intbo' }
        ]
      },
      {
        id: '2', text: 'Governo do Estado de Alagoas', chields: [
          {
            id: '2.1', text: 'Secretaria de Segurança Pública da Defesa Social de Alagoas', chields: [
              { id: '2.1.1', text: 'Polícia Militar de Alagoas' },
              { id: '2.1.2', text: 'Corpo de Bombeiros Militar de Alagoas' },
              { id: '2.1.3', text: 'Polícia Civil de Alagoas' },
            ]
          },
          {
            id: '2.2', text: 'Governo do Estado de Amapá', chields: [
              {
                id: '2.2.1', text: 'Secretaria de Segurança Pública da Justiça e Segurança Pública do Amapá', chields: [
                  { id: '2.2.1.1', text: 'Polícia Militar do Amapá' },
                  { id: '2.2.1.2', text: 'Corpo de Bombeiros Militar do Amapá' },
                  {
                    id: '2.2.1.3', text: 'Polícia Civil do Amapá', chields: [
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
        id: '3', text: 'Governo do Estado de Amazonas', chields: [
          {
            id: '3.1', text: 'Secretaria de Segurança Pública do Amazonas', chields: [
              { id: '3.1.1', text: 'Polícia Militar do Amazonas' },
              { id: '3.1.2', text: 'Corpo de Bombeiros Militar do Amazonas' },
              {
                id: '3.1.3', text: 'Polícia Civil do Amazonas', chields: [
                  { id: '3.1.3.1', text: '1º Distrito Policial - Manaus' }
                ]
              }
            ]
          },
          {
            id: '3.2', text: 'Governo do Estado de Bahia', chields: [
              {
                id: '3.2.1', text: 'Secretaria de Segurança Pública de Bahia', chields: [
                  { id: '3.2.1.1', text: 'Polícia Militar da Bahia' },
                  { id: '3.2.1.2', text: 'Corpo de Bombeiros Militar da Bahia' },
                  { id: '3.2.1.3', text: 'Polícia Civil da Bahia' }
                ]
              },
              {
                id: '3.2.2', text: 'Governo do Estado de Ceará', chields: [
                  {
                    id: '3.2.2.1', text: 'Secretaria de Segurança Pública da e Defesa Social do Ceará', chields: [
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
            id: '3.3', text: 'Governo do Distrito Federal', chields: [
              {
                id: '3.3.1', text: 'Secretaria de Estado de Segurança Pública e Defesa Social do Distrito Federal', chields: [
                  {
                    id: '3.3.1.1', text: 'Polícia Militar do Distrito Federal', chields: [
                      { id: '3.3.1.1.1', text: 'Guarda Municipal' }
                    ]
                  },
                  { id: '3.3.1.2', text: 'Corpo de Bombeiros Militar do Distrito Federal' },
                  {
                    id: '3.3.1.3', text: 'Polícia Civil do Distrito Federal', chields: [
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
            id: '3.4', text: 'Governo do Estado de Espírito Santo', chields: [
              {
                id: '3.4.1', text: 'Secretaria de Segurança Pública e Defesa Social do Espírito Santo', chields: [
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

  private possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
  public gerarArvoreRandomica(passo: number = 0, maxStack = 4): DataTree[] {
    if (passo >= maxStack) { return []; }
    let rt: DataTree[] = [];

    let numNodos = Util.getRandomInt(3, 15);
    for (let i = 0; i < numNodos; i++) {
      let dtTree = new DataTree(Util.getRandomInt(1, 1500) + '', Util.getRandomText(30, this.possible));
      if (!Util.getRandomBoolean()) { continue; }
      let filhosAux = this.gerarArvoreRandomica(passo + 1, maxStack);
      if (filhosAux.length > 0) {
        filhosAux.forEach(fadd => dtTree.addFilho(fadd));
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

  public getData(): DataTree[] | undefined {
    return this.convert(this.jsonData)
  }

  // nós iniciais da árvore, sem filhos
  public getInitialData(): Observable<DataTree[] | undefined> | undefined {
    let dadosAux: DataTree[] | undefined = this.getData();
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
    let dadosAux: DataTree[] | undefined = this.convert(this.jsonData); // base de dados
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
            d.addFilho(aux[y]);
          }
        }
      }
      rt.push(d);
    };

    return rt;
  }

  // --------------- filtrarData ---------------
  public filtrarData(filtro: string): Observable<DataTree[] | undefined> | undefined {
    let rt = this.filtrarDataAux(this.getData(), filtro);
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
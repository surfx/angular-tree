import { Injectable } from '@angular/core';
import { DataTree } from '../entidades/data-tree';

@Injectable({
  providedIn: 'root'
})
export class DadosArvoreService {

  constructor() { }

  private jsonData = [
    {
      id: '1', text: 'item 1', childs: [
        { id: '1.1', text: 'item 1.1' },
        { id: '1.2', text: 'item 1.2' },
        { id: '1.3', text: 'item 1.3' }
      ]
    },
    {
      id: '2', text: 'item 2', childs: [
        { id: '2.1', text: 'item 2.1' },
        { id: '2.2', text: 'Ana Banana' }
      ]
    },
    {
      id: '3', text: 'item 3', childs: [
        { id: '3.1', text: 'item 3.1' },
        {
          id: '3.2', text: 'item 3.2', childs: [
            {
              id: '3.2.1', text: 'item 3.2.1', childs: [
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

  public getData(): DataTree[] | undefined {
    return this.convert(this.jsonData)
  }

  // nós iniciais da árvore, sem filhos
  public getInitialData(): DataTree[] | undefined {
    let dadosAux: DataTree[] | undefined = this.getData();
    if (dadosAux === undefined) { return undefined; }

    let rt: DataTree[] = [];
    dadosAux.forEach(d => {
      if (d === undefined || d === null) { return; }
      rt.push(new DataTree(d.id, d.texto)); // suprimir os filhos (para teste)
    });
    return rt;
  }

  // para o exemplo não vou retornar os subfilhos
  public loadFilhos(id: string): DataTree[] | undefined {
    let dadosAux: DataTree[] | undefined = this.convert(this.jsonData); // base de dados
    if (id === null || id === undefined || dadosAux === undefined) { return undefined; }
    return this.loadFilhosAux(id, dadosAux);
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
        aux.forEach(a => 
          {
            a.selecionado = false;
            rt?.push(new DataTree(a.id, a.texto));
          }
        ); 
      }
    });

    return rt;
  }

  private convert(json: any[]): DataTree[] | undefined {
    let ok = (obj: any) => obj !== undefined && obj !== null;
    if (!ok(json) || json.length <= 0) { return undefined; }
    let rt: DataTree[] = [];

    json.forEach(j => {
      if (!ok(j) || !ok(j.id) || !ok(j.text)) { return; }
      let d: DataTree = new DataTree(j.id + '', j.text);
      if (ok(j.childs)) {
        let aux = this.convert(j.childs);
        if (ok(aux) && aux !== undefined && aux?.length > 0) {
          aux.forEach(a => d.addFilho(a));
        }
      }
      rt.push(d);
    });

    return rt;
  }

  // --------------- filtrarData ---------------
  public filtrarData(filtro: string): DataTree[] | undefined {
    return this.filtrarDataAux(this.getData(), filtro);
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
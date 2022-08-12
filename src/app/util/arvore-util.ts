import { DataTree } from "../entidades/data-tree";
import { Util } from "./util";

export class ArvoreUtil {

    private _possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    private _controleIds: Set<string> = new Set<string>();

    constructor() { }

    //#region gerar árvore
    public getArvoreRandomica(maxStack = 4): DataTree[] {
        if (maxStack <= 0) { maxStack = 4; }
        this._controleIds.clear();
        return this.gerarArvoreRandomica(0, maxStack);
    }

    public getArvoreJsonRandomica(maxStack = 4): any[] | undefined {
        if (maxStack <= 0) { maxStack = 4; }
        this._controleIds.clear();
        return this.gerarArvoreJsonRandomica(0, maxStack);
    }

    private gerarArvoreRandomica(passo: number = 0, maxStack = 4): DataTree[] {
        if (passo >= maxStack) { return []; }
        let rt: DataTree[] = [];

        let numNodos = Util.getRandomInt(3, 15);
        for (let i = 0; i < numNodos; i++) {
            let dtTree = new DataTree(this.getNextId(), Util.getRandomText(30, this._possible));
            if (!Util.getRandomBoolean()) { continue; }
            let filhosAux = this.gerarArvoreRandomica(passo + 1, maxStack);
            if (filhosAux.length > 0) {
                filhosAux.forEach(fadd => dtTree.addFilho(fadd, false));
            }
            rt.push(dtTree);
        }
        return rt;
    }

    private getNextId(): string {
        let id = Util.getRandomInt(1, 15000) + '';
        while (this._controleIds.has(id)) {
            id = Util.getRandomInt(1, 15000) + '';
        }
        this._controleIds.add(id);
        return id;
    }

    private gerarArvoreJsonRandomica(passo: number = 0, maxStack = 4): any[] | undefined {
        if (passo >= maxStack) { return undefined; }
        let rt: any[] | undefined = [];

        let numNodos = Util.getRandomInt(3, 15);
        for (let i = 0; i < numNodos; i++) {
            let dtTree: any = { id: this.getNextId(), text: Util.getRandomText(30, this._possible), children: undefined };
            if (!Util.getRandomBoolean()) { rt.push(dtTree); continue; }
            let filhosAux = this.gerarArvoreJsonRandomica(passo + 1, maxStack);
            if (filhosAux !== undefined && filhosAux.length > 0) {
                dtTree.children = filhosAux;
            }
            rt.push(dtTree);
        }

        return rt;
    }
    //#endregion

    //#region converter
    public static convertJsonToDataTree(json: any[] | undefined): DataTree[] | undefined {
        if (json === undefined) { return undefined; }
        let ok = (obj: any) => obj !== undefined && obj !== null;
        if (!ok(json) || json.length <= 0) { return undefined; }
        let rt: DataTree[] = [];

        for (let i = 0; i < json.length; i++) {
            let jaux = json[i];
            if (!ok(jaux) || !ok(jaux.id) || !ok(jaux.text)) { continue; }
            let d: DataTree = new DataTree(jaux.id + '', jaux.text);
            if (!ok(jaux.children)) {
                rt.push(d);
                continue;
            }
            let aux = this.convertJsonToDataTree(jaux.children);
            if (ok(aux) && aux !== undefined && aux?.length > 0) {
                for (let j = 0; j < aux.length; j++) {
                    d.addFilho(aux[j], false);
                }
            }
            rt.push(d);
        };

        return rt;
    }
    //#endregion

    //#region print tree - console.log
    public static printDt(dados: DataTree[] | undefined, id: boolean = false) {
        if (dados === undefined || dados.length <= 0) { return; }
        dados.forEach(d => this.print(d, '', id));
    }

    private static print(item: DataTree, space: string = '', id: boolean = false) {
        if (item === undefined || item.texto === undefined) { return; }
        console.log(space + (id ? item.id + ' ' : '') + item.texto);
        if (item.temFilhos() && item.filhos !== undefined) {
            item.filhos.forEach(f => {
                if (f === undefined) { return; }
                this.print(f, '  ' + space);
            });
        }
    }
    //#endregion

    //#region to map
    /**
     * Conversão apenas do primeiro level para Map<string, DataTree>
     * @param dados 
     * @returns 
     */
    public static toMapFirstLevel(dados: DataTree[]): Map<string, DataTree> | undefined {
        if (dados === undefined || dados.length <= 0) { return undefined; }
        let rt: Map<string, DataTree> = new Map<string, DataTree>();
        dados.forEach(d => rt.set(d.id, d));
        return rt;
    }

    /**
     * conversão completa do array DataTree[] para um Map<string, DataTree>
     * @param dados
     * @returns 
     */
    public static toMapDt(dados: DataTree[]): Map<string, DataTree> | undefined {
        if (dados === undefined || dados.length <= 0) { return undefined; }
        let rt: Map<string, DataTree> = new Map<string, DataTree>();
        dados.forEach(d => {
            let aux: Map<string, DataTree> | undefined = this.toMapAux(d);
            if (aux === undefined) { return; }
            aux.forEach((v, k) => rt.set(k, v));
        });
        return rt;
    }

    private static toMapAux(item: DataTree): Map<string, DataTree> | undefined {
        if (item === undefined || item.texto === undefined) { return undefined; }
        let rt: Map<string, DataTree> = new Map<string, DataTree>();
        rt.set(item.id, item);
        if (item.temFilhos() && item.filhos !== undefined) {
            item.filhos.forEach(f => {
                if (f === undefined) { return; }
                let aux: Map<string, DataTree> | undefined = this.toMapAux(f);
                if (aux === undefined) { return; }
                aux.forEach((v, k) => rt.set(k, v));
            });
        }
        return rt;
    }
    //#endregion

    //#region merge
    /**
     * Merge de duas árvores DataTree[]
     * @param dados1 árvore 1
     * @param dados2 árvore 2
     * @returns 
     */
    public static mergeDt(dados1: DataTree[] | undefined, dados2: DataTree[] | undefined): DataTree[] | undefined {
        if (dados1 === undefined || dados1.length <= 0 || dados2 === undefined || dados2.length <= 0) { return dados1 ?? dados2; }

        let vids1 = [...dados1.map(item => item.id)];
        let dtAux = dados2.filter(v => vids1.indexOf(v.id) < 0); // itens que existem no vetor 2, mas não no vetor 1

        //let map2: Map<string, DataTree> | undefined = this.toMapDt(dados2);
        let map2: Map<string, DataTree> | undefined = ArvoreUtil.toMapFirstLevel(dados2);

        let rt: DataTree[] = [];

        dados1.forEach(item1 => {
            if (map2 === undefined || map2.size <= 0 || !map2.has(item1.id)) {
                rt.push(item1);
                return;
            }
            let item2: DataTree | undefined = map2.get(item1.id);
            if (item2 === undefined) {
                rt.push(item1);
                return;
            }

            let filhos1: DataTree[] | undefined = item1.filhos;
            let filhos2: DataTree[] | undefined = item2.filhos;
            if (filhos1 === undefined || filhos2 === undefined) {
                item1.filhos = filhos1 ?? filhos2;
                rt.push(item1);
                return;
            }
            item1.filhos = this.mergeDt(filhos1, filhos2);
            rt.push(item1);
        });

        if (dtAux !== undefined && dtAux.length > 0) {
            dtAux.forEach(d => rt.push(d));
        }

        return rt;
    }

    /**
     * atualiza a estrutura de árvore caso algum filho tenha sido alterado
     * @param dados 
     * @param itemAtualizado 
     * @returns 
     */
    public static atualizarFilhos(dados: DataTree[] | undefined, itemAtualizado: DataTree | undefined): boolean {
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
    //#endregion

    //#region filter
    /**
     * filtra uma árvore pelo texto.
     * Retorna toda subárvore onde a folha contém o texto de filtro informado, para n filhos
     * @param dados 
     * @param filtro 
     * @returns 
     */
    public static findSubTree(dados: DataTree[] | undefined, filtro: string): DataTree[] | undefined {
        if (dados === undefined || filtro === undefined || filtro === null || filtro.length <= 0) { return dados; }
        filtro = filtro.toLowerCase().trim();
        if (filtro.length <= 0) { return dados; }

        let rt: DataTree[] = [];
        let filhosAux: DataTree[] | undefined = [];

        let addItem: DataTree | undefined = undefined;
        for (let i = 0; i < dados.length; i++) {
            addItem = undefined;
            filhosAux = undefined;

            let d = dados[i];
            if (d === undefined) { continue; }
            if (d.texto.trim().toLowerCase().indexOf(filtro) >= 0) { // encontrou o filtro
                addItem = d.clone();
            }

            // verificar os filhos
            if (d.temFilhos() && d.filhos !== undefined) {
                let fAux: DataTree[] | undefined = this.findSubTree(d.filhos, filtro);
                if (fAux !== undefined) { // encontrou o filtro nos filhos
                    if (filhosAux === undefined) { filhosAux = []; }
                    for (let j = 0; j < fAux.length; j++) {
                        if (fAux[j] === undefined) { continue; }
                        filhosAux.push(fAux[j]);
                    }
                }
            }
            if (filhosAux !== undefined) {
                if (addItem === undefined) { addItem = d.clone(); }
                addItem.filhos = filhosAux;
            }

            if (addItem !== undefined) {
                rt.push(addItem);
            }
        }

        return rt.length > 0 ? rt : undefined;
    }
    //#endregion

}
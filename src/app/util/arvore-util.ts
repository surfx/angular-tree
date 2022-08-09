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
            let dtTree: any = { id: this.getNextId(), text: Util.getRandomText(30, this._possible), chields: undefined };
            if (!Util.getRandomBoolean()) { rt.push(dtTree); continue; }
            let filhosAux = this.gerarArvoreJsonRandomica(passo + 1, maxStack);
            if (filhosAux !== undefined && filhosAux.length > 0) {
                dtTree.chields = filhosAux;
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
            if (!ok(jaux.chields)) {
                rt.push(d);
                continue;
            }
            let aux = this.convertJsonToDataTree(jaux.chields);
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
    public static printDt(dados: DataTree[] | undefined) {
        if (dados === undefined || dados.length <= 0) { return; }
        dados.forEach(d => this.print(d));
    }

    private static print(item: DataTree, space: string = '') {
        if (item === undefined || item.texto === undefined) { return; }
        console.log(space + item.texto);
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

        if (dtAux !== undefined && dtAux.length >= 0) {
            dtAux.forEach(d => rt.push(d));
        }

        return rt;
    }
    //#endregion

}
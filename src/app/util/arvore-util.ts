import { DataTree } from "../entidades/data-tree";
import { Util } from "./util";

export class ArvoreUtil {

    private _possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
    private _controleIds: Set<string> = new Set<string>();

    constructor() { }

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

}
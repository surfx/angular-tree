import { Subject } from "rxjs";

/**
 * Nó da Árvore
 */
export class DataTree {

    id: string;
    texto: string = '';
    selecionado: boolean = false;
    jaClicado: boolean = false; // evitar sub loads (load filho)
    aberto: boolean = true;
    isLoading: boolean = false;
    //pai?: Dados = undefined; - não precisa e pode gerar recursividade em loop eterno
    filhos?: DataTree[] = undefined;

    // acionado cada vez que um filho é adicionado
    public filhoAdicionado: Subject<DataTree> = new Subject<DataTree>();

    constructor(id: string, texto: string = '') {
        this.id = id;
        this.texto = texto;
    }

    public temFilhos = (): boolean => {
        return this.filhos !== null && this.filhos !== undefined && this.filhos.length > 0;
    }

    public addFilho = (filho: DataTree, selecaoPai: boolean) => {
        if (filho === null || filho === undefined) { return; }
        if (this.filhos === null || this.filhos == undefined) { this.filhos = []; }
        //filho.pai = this;
        if (selecaoPai) { filho.selecionado = this.selecionado; }

        // por algum motivo o push diretamente em 'this.filhos' não renderiza novamente o componente
        let filhosAux = Object.assign([], this.filhos);
        filhosAux.push(filho);
        this.filhos = filhosAux;

        this.filhoAdicionado.next(filho);
    }

    public selecionarFilhos = () => {
        if (!this.temFilhos() || !this.filhos) { return; }
        for (let i = 0; i < this.filhos.length; i++) {
            this.selFilhos(this.filhos[i], this.selecionado);
        }
    }

    private selFilhos = (item: DataTree, selecao: boolean): void => {
        if (item === undefined || item === null) { return; }
        item.selecionado = selecao;
        if (item.temFilhos() && item.filhos) {
            for (let i = 0; i < item.filhos.length; i++) {
                this.selFilhos(item.filhos[i], selecao);
            }
        }
    }

    public todosFilhosSelecionados = (): boolean => {
        if (!this.temFilhos() || !this.filhos) { return true; }
        return this.todosFilhosSelecionadosAux(this.filhos);
    }

    private todosFilhosSelecionadosAux = (item: DataTree[] | undefined): boolean => {
        if (item === null || item === undefined) { return true; } // não tem o que verificar
        for (let i = 0; i < item.length; i++) {
            if (!item[i].selecionado) {
                return false; // 1 filho não está selecionado
            }
            // se algum subfilho não está selecionado, retorna false
            if (item[i].temFilhos() && item[i].filhos !== undefined) {
                let aux = this.todosFilhosSelecionadosAux(item[i].filhos);
                if (!aux) { return false; }
            }
        }
        return true;
    }

    public clone(): DataTree {
        let rt: DataTree = new DataTree(this.id, this.texto);
        rt.selecionado = this.selecionado;
        rt.jaClicado = this.jaClicado;
        return rt;
    }

    public toString = (): string => {
        return `${this.id} ${this.texto}`;
    }

}
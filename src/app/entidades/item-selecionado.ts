export class ItemSelecionado {

    id: string;
    texto: string = '';

    constructor(id: string, texto: string = '') {
        this.id = id;
        this.texto = texto;
    }

    public toString = (): string => {
        return `{${this.id} ${this.texto}}`;
    }

}
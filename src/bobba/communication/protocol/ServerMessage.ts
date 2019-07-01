export default class ServerMessage {
    pointer: number;
    id: number;
    tokens: string[];

    constructor(data: string) {
        this.pointer = 0;
        this.tokens = data.split(SEPARATOR);
        this.id = this.popInt();
    }

    popToken(): string {
        if (this.tokens.length > this.pointer) {
            return this.tokens[this.pointer++];
        }
        return "";
    }

    popInt(): number {
        return parseInt(this.popToken());
    }

    popFloat(): number {
        return parseFloat(this.popToken());
    }

    popString(): string {
        const tickets = this.popInt();
        let str = this.popToken();
        for (let i = 0; i < tickets; i++) {
            str += SEPARATOR + this.popToken();
        }
        return str;
    }

    popBoolean(): boolean {
        return this.popInt() === 1;
    }
}

const SEPARATOR = '|';
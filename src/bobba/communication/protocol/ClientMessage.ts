export default class ClientMessage {
    body: string;

    constructor(id: number) {
        this.body = id + "";
    }

    appendToken(token: string) {
        this.body = SEPARATOR + token;
    }

    appendInt(i: number) {
        this.appendToken(i + "");
    }

    appendString(str: string) {
        let tickets = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) == SEPARATOR) {
                tickets++;
            }
        }
        this.appendInt(tickets);
        this.appendToken(str);
    }
}

const SEPARATOR = '|';
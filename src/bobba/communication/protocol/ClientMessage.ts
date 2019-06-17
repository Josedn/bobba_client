export default class ClientMessage {
    body: string;
    id: number;

    constructor(id: number) {
        this.id = id;
        this.body = String(id);
    }

    appendToken(token: string) {
        this.body += SEPARATOR + token;
    }

    appendInt(i: number) {
        this.appendToken(String(i));
    }

    appendString(str: string) {
        let tickets = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) === SEPARATOR) {
                tickets++;
            }
        }
        this.appendInt(tickets);
        this.appendToken(str);
    }
}

const SEPARATOR = '|';
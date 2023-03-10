import ClientMessage from "../../protocol/ClientMessage";
import { LOGIN } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestLogin extends ClientMessage {
    constructor(username: string, password: string, look: string) {
        super(LOGIN);
        this.appendString(username);
        this.appendString(look);
        this.appendString(password);
    }
}
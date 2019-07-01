import ClientMessage from "../../protocol/ClientMessage";
import { LOGIN } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestLogin extends ClientMessage {
    constructor(username: string, look: string) {
        super(LOGIN);
        this.appendString(username);
        this.appendString(look);
    }
}
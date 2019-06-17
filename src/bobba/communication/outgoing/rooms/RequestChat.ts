import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_CHAT } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestChat extends ClientMessage {
    constructor(chat: string) {
        super(REQUEST_CHAT);
        this.appendString(chat);
    }
}
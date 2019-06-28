import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_CHANGE_LOOKS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestChangeLooks extends ClientMessage {
    constructor(look: string, gender: string) {
        super(REQUEST_CHANGE_LOOKS);
        this.appendString(look);
        this.appendString(gender);
    }
}
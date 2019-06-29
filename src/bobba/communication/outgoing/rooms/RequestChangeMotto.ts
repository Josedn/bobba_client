import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_CHANGE_MOTTO } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestChangeMotto extends ClientMessage {
    constructor(motto: string) {
        super(REQUEST_CHANGE_MOTTO);
        this.appendString(motto);
    }
}
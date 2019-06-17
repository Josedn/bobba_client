import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_LOOK_AT } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestLookAt extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_LOOK_AT);
        this.appendInt(userId);
    }
}
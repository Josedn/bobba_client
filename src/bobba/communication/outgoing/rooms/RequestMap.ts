import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MAP } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMap extends ClientMessage {
    constructor() {
        super(REQUEST_MAP);
    }
}
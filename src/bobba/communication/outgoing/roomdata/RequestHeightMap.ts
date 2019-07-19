import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_HEIGHT_MAP } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestHeightMap extends ClientMessage {
    constructor() {
        super(REQUEST_HEIGHT_MAP);
    }
}
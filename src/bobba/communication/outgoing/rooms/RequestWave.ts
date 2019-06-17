import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_WAVE } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestWave extends ClientMessage {
    constructor() {
        super(REQUEST_WAVE);
    }
}
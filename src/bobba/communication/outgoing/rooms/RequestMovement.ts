import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MOVEMENT } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMovement extends ClientMessage {
    constructor(x: number, y: number) {
        super(REQUEST_MOVEMENT);
        this.appendInt(x);
        this.appendInt(y);
    }
}
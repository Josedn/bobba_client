import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_GO_TO_ROOM } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorGoToRoom extends ClientMessage {
    constructor(roomId: number) {
        super(REQUEST_NAVIGATOR_GO_TO_ROOM);
        this.appendInt(roomId);
    }
}
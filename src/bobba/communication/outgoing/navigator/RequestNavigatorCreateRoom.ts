import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_CREATE_ROOM } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorCreateRoom extends ClientMessage {
    constructor(roomName: string, modelId: string) {
        super(REQUEST_NAVIGATOR_CREATE_ROOM);
        this.appendString(roomName);
        this.appendString(modelId);
    }
}
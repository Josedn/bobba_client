import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_REMOVE_FAVOURITE } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorRemoveFavourite extends ClientMessage {
    constructor(roomId: number) {
        super(REQUEST_NAVIGATOR_REMOVE_FAVOURITE);
        this.appendInt(roomId);
    }
}
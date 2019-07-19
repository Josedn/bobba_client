import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_MAKE_FAVOURITE } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorMakeFavourite extends ClientMessage {
    constructor(roomId: number) {
        super(REQUEST_NAVIGATOR_MAKE_FAVOURITE);
        this.appendInt(roomId);
    }
}
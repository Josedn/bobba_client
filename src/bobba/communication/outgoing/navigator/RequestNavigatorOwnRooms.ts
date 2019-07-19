import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_OWN_ROOMS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorOwnRooms extends ClientMessage {
    constructor() {
        super(REQUEST_NAVIGATOR_OWN_ROOMS);
    }
}
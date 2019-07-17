import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_POPULAR_ROOMS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorPopularRooms extends ClientMessage {
    constructor() {
        super(REQUEST_NAVIGATOR_POPULAR_ROOMS);
    }
}
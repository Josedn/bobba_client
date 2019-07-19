import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_SEARCH_ROOMS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorSearchRooms extends ClientMessage {
    constructor(search: string) {
        super(REQUEST_NAVIGATOR_SEARCH_ROOMS);
        this.appendString(search);
    }
}
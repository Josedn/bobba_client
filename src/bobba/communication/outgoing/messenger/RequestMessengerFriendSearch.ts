import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_SEARCH_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerSearchFriend extends ClientMessage {
    constructor(search: string) {
        super(REQUEST_MESSENGER_SEARCH_FRIEND);
        this.appendString(search);
    }
}
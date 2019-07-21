import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_ACCEPT_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerAcceptFriend extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_MESSENGER_ACCEPT_FRIEND);
        this.appendInt(userId);
    }
}
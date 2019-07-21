import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_DENY_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerDenyFriend extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_MESSENGER_DENY_FRIEND);
        this.appendInt(userId);
    }
}
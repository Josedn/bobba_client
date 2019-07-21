import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_ADD_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerAddFriend extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_MESSENGER_ADD_FRIEND);
        this.appendInt(userId);
    }
}
import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_REMOVE_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerRemoveFriend extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_MESSENGER_REMOVE_FRIEND);
        this.appendInt(userId);
    }
}
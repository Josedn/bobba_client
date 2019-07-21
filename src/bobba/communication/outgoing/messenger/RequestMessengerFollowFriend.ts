import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_FOLLOW_FRIEND } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerFollowFriend extends ClientMessage {
    constructor(userId: number) {
        super(REQUEST_MESSENGER_FOLLOW_FRIEND);
        this.appendInt(userId);
    }
}
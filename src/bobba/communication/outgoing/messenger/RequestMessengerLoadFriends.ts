import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_LOAD_FRIENDS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerLoadFriends extends ClientMessage {
    constructor() {
        super(REQUEST_MESSENGER_LOAD_FRIENDS);
    }
}
import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_MESSENGER_SEND_MESSAGE } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestMessengerSendMessage extends ClientMessage {
    constructor(userId: number, text: string) {
        super(REQUEST_MESSENGER_SEND_MESSAGE);
        this.appendInt(userId);
        this.appendString(text);
    }
}
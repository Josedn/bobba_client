import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_ITEM_INTERACT } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestFurniInteract extends ClientMessage {
    constructor(itemId: number) {
        super(REQUEST_ITEM_INTERACT);
        this.appendInt(itemId);
    }
}
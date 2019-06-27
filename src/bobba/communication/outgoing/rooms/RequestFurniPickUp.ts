import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_ITEM_PICK_UP } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestFurniPickUp extends ClientMessage {
    constructor(itemId: number) {
        super(REQUEST_ITEM_PICK_UP);
        this.appendInt(itemId);
    }
}
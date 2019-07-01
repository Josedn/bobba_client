import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_INVENTORY_ITEMS } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestInventoryItems extends ClientMessage {
    constructor() {
        super(REQUEST_INVENTORY_ITEMS);
    }
}
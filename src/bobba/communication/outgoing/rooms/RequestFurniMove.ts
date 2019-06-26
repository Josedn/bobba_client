import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_ITEM_MOVE } from "../../protocol/OpCodes/ClientOpCodes";
import { Direction } from "../../../imagers/furniture/FurniImager";

export default class RequestFurniMove extends ClientMessage {
    constructor(itemId: number, x: number, y: number, rotation: Direction) {
        super(REQUEST_ITEM_MOVE);
        this.appendInt(itemId);
        this.appendInt(x);
        this.appendInt(y);
        this.appendInt(rotation);
    }
}
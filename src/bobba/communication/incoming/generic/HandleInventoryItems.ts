import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import { ItemType } from "../../../imagers/furniture/FurniImager";

export default class HandleInventoryItems implements IIncomingEvent {
    handle(request: ServerMessage) {
        const count = request.popInt();
        for (let i = 0; i < count; i++) {
            const itemId = request.popInt();
            const itemType = request.popString() === 'F' ? ItemType.FloorItem : ItemType.WallItem;
            const baseId = request.popInt();
            const state = request.popInt();
            const isStackable = request.popBoolean();

            BobbaEnvironment.getGame().inventory.addItem(itemId, baseId, state, isStackable, itemType);
        }
    }
}
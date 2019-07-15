import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
//import { ItemType } from "../../../imagers/furniture/FurniImager";

export default class HandleCataloguePurchaseInformation implements IIncomingEvent{
    handle(request: ServerMessage): void {
        /*const itemId = request.popInt();
        const itemName = request.popString();
        const cost = request.popInt();
        const itemType = request.popString() === 'F' ? ItemType.FloorItem : ItemType.WallItem;
        const baseId = request.popInt();*/

        //TODO: notify purchase????
    }
}
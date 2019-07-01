import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleInventoryItemRemove implements IIncomingEvent {
    handle(request: ServerMessage) {
        const itemId = request.popInt();
        BobbaEnvironment.getGame().inventory.removeItem(itemId);
    }
}
import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomItemState implements IIncomingEvent {
    handle(request: ServerMessage) {
        const itemId = request.popInt();
        const state = request.popInt();
        const room = BobbaEnvironment.getGame().currentRoom;
        if (room != null) {
            room.roomItemManager.itemSetState(itemId, state);
        }
    }
}
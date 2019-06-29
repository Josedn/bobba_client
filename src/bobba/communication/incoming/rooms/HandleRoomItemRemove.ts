import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomItemRemove implements IIncomingEvent {
    handle(request: ServerMessage) {
        const itemId = request.popInt();
        const room = BobbaEnvironment.getGame().currentRoom;
        if (room != null) {
            room.roomItemManager.removeItemFromRoom(itemId, true);
        }
    }
}
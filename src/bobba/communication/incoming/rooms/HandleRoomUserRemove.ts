import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomUserRemove implements IIncomingEvent {
    handle(request: ServerMessage) {
        const userId = request.popInt();
        const room = BobbaEnvironment.getGame().currentRoom;
        if (room != null) {
            room.roomUserManager.removeUserFromRoom(userId, true);
        }
    }
}
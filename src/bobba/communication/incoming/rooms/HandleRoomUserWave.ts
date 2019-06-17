import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomUserWave implements IIncomingEvent {
    handle(request: ServerMessage) {
        const userId = request.popInt();
        const room = BobbaEnvironment.getGame().currentRoom;
        if (room != null) {
            room.roomUserManager.userWave(userId);
        }
    }
}
import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleIncomingChat implements IIncomingEvent {
    handle(request: ServerMessage) {
        const userId = request.popInt();
        const text = request.popString();

        const room = BobbaEnvironment.getGame().currentRoom;
        if (room != null) {
            //room.roomUserManager.addUserToRoom(id, x, y, z, rot as Direction, name, look);
        }
    }
}
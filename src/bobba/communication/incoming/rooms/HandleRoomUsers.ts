import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import { Direction } from "../../../imagers/avatars/AvatarInfo";

export default class HandleRoomUsers implements IIncomingEvent {
    handle(request: ServerMessage) {
        const count = request.popInt();
        for (let i = 0; i < count; i++) {
            const id = request.popInt();
            const x = request.popInt();
            const y = request.popInt();
            const z = request.popFloat();
            const rot = request.popInt();
            const name = request.popString();
            const look = request.popString();
            const motto = request.popString();

            const room = BobbaEnvironment.getGame().currentRoom;
            if (room != null) {
                room.roomUserManager.addUserToRoom(id, x, y, z, rot as Direction, name, look, motto);
            }
        }
    }
}
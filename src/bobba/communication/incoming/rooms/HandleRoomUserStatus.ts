import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import { Direction } from "../../../imagers/avatars/AvatarInfo";
import { StatusContainer } from "../../../rooms/users/RoomUser";

export default class HandleRoomUserStatus implements IIncomingEvent {
    handle(request: ServerMessage) {
        const count = request.popInt();
        for (let i = 0; i < count; i++) {
            const id = request.popInt();
            const x = request.popInt();
            const y = request.popInt();
            const z = request.popFloat();
            const rot = request.popInt();
            const statusesCount = request.popInt();
            const statuses: { [key: string]: string } = {};

            for (let j = 0; j < statusesCount; j++) {
                const key = request.popString();
                const value = request.popString();
                statuses[key] = value;
            }

            const room = BobbaEnvironment.getGame().currentRoom;
            if (room != null) {
                room.roomUserManager.updateUserStatus(id, x, y, z, rot as Direction, statuses as StatusContainer);
            }
        }
    }
}
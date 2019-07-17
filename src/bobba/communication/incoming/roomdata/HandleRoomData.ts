import ServerMessage from "../../protocol/ServerMessage";
import IIncomingEvent from "../IIncomingEvent";
import RoomData, { LockType } from "../../../navigator/RoomData";
import BobbaEnvironment from "../../../BobbaEnvironment";

export const getRoomData = (request: ServerMessage): RoomData => {
    const id = request.popInt();
    const name = request.popString();
    const owner = request.popString();
    const description = request.popString();
    const lockTypeId = request.popInt();
    const userCount = request.popInt();
    const capacity = request.popInt();

    let lockType = LockType.Open;
    if (lockTypeId === 1) {
        lockType = LockType.Locked;
    } else if (lockTypeId === 2) {
        lockType = LockType.Password;
    }

    return new RoomData(id, name, owner, description, capacity, userCount, false, lockType);
};
export default class HandleRoomData implements IIncomingEvent {
    handle(request: ServerMessage) {
        const data = getRoomData(request);
        
        BobbaEnvironment.getGame().navigator.handleCurrentRoomData(data);
    }
}
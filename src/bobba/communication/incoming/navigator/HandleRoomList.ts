import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import { getRoomData } from "../roomdata/HandleRoomData";
import RoomData from "../../../navigator/RoomData";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomList implements IIncomingEvent {
    handle(request: ServerMessage): void {
        const count = request.popInt();
        const roomDatas: RoomData[] = [];
        for (let i = 0; i < count; i++) {
            const data = getRoomData(request);
            roomDatas.push(data);
        }

        BobbaEnvironment.getGame().navigator.handleRoomDataList(roomDatas);
    }
}
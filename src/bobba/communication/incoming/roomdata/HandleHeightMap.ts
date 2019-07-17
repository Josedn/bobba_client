import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import RoomModel from "../../../rooms/RoomModel";

export default class HandleHeightMap implements IIncomingEvent {
    handle(request: ServerMessage) {
        const cols = request.popInt();
        const rows = request.popInt();
        const doorX = request.popInt();
        const doorY = request.popInt();

        const heightmap: number[][] = [];

        for (let i = 0; i < cols; i++) {
            heightmap.push([]);
            for (let j = 0; j < rows; j++) {
                heightmap[i].push(request.popInt());
            }
        }

        const model = new RoomModel(cols, rows, doorX, doorY, heightmap);
        BobbaEnvironment.getGame().handleHeightMap(model);
    }
}
import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleRoomModelInfo implements IIncomingEvent {
    handle(request: ServerMessage) {
        const modelId = request.popString();
        const roomId = request.popInt();

        BobbaEnvironment.getGame().handleRoomModelInfo(modelId, roomId);
    }
}
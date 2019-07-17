import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleLeaveRoom implements IIncomingEvent {
    handle(request: ServerMessage): void {
        BobbaEnvironment.getGame().unloadRoom();
    }
    
}
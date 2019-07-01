import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class LoginOk implements IIncomingEvent {
    handle(request: ServerMessage) {

        const id = request.popInt();
        const name = request.popString();
        const look = request.popString();
        const motto = request.popString();
        BobbaEnvironment.getGame().handleUserData(id, name, look, motto);
    }
}
import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class LoginOk implements IIncomingEvent {
    handle(request: ServerMessage) {
        BobbaEnvironment.getGame().handleLoggedIn();
    }
}
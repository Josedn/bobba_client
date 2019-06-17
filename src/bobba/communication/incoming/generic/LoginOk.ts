import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";

export default class LoginOk implements IIncomingEvent {
    handle(request: ServerMessage) {
        //TODO: begin room loading
    }
}
import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleMessengerUpdateFriend implements IIncomingEvent {
    handle(request: ServerMessage) {
        const id = request.popInt();
        const username = request.popString();
        const look = request.popString();
        const motto = request.popString();
        const isOnline = request.popBoolean();

        const user = BobbaEnvironment.getGame().userManager.setUser(id, username, motto, look);

        BobbaEnvironment.getGame().messenger.handleUpdateFriend(user, isOnline);
    }
}
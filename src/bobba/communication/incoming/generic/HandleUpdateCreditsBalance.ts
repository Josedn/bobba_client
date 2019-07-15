import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleUpdateCreditsBalance implements IIncomingEvent{
    handle(request: ServerMessage): void {
        const credits = request.popInt();   
        BobbaEnvironment.getGame().userManager.updateCreditsBalance(credits);
    }
}
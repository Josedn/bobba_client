import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";

export default class HandleCataloguePurchaseError implements IIncomingEvent{
    handle(request: ServerMessage): void {
        const notEnoughCredits = request.popBoolean();
        if (notEnoughCredits) {
            BobbaEnvironment.getGame().uiManager.onShowNotification('Not enough credits');
        }
    }
}
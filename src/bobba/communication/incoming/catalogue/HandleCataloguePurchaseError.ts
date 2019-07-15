import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";

export default class HandleCataloguePurchaseError implements IIncomingEvent{
    handle(request: ServerMessage): void {
        const notEnoughCredits = request.popBoolean();
    }
}
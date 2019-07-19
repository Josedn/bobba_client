import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_NAVIGATOR_LEAVE_ROOM } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestNavigatorLeaveRoom extends ClientMessage {
    constructor() {
        super(REQUEST_NAVIGATOR_LEAVE_ROOM);
    }
}
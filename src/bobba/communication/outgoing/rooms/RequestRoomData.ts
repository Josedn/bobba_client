import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_ROOM_DATA } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestRoomData extends ClientMessage {
    constructor() {
        super(REQUEST_ROOM_DATA);
    }
}
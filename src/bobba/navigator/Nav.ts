import BobbaEnvironment from "../BobbaEnvironment";
import RequestNavigatorSearchRooms from "../communication/outgoing/navigator/RequestNavigatorSearchRooms";
import RequestNavigatorPopularRooms from "../communication/outgoing/navigator/RequestNavigatorPopularRooms";
import RequestNavigatorOwnRooms from "../communication/outgoing/navigator/RequestNavigatorOwnRooms";
import RequestNavigatorLeaveRoom from "../communication/outgoing/navigator/RequestNavigatorLeaveRoom";

export default class Nav {

    requestSearchRooms(search: string) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorSearchRooms(search));
    }

    requestPopularRooms() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorPopularRooms());
    }

    requestOwnRooms() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorOwnRooms());
    }

    requestGoToRoom(roomId: number) {
        
    }

    requestLeaveRoom() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorLeaveRoom());
    }
}
import BobbaEnvironment from "../BobbaEnvironment";
import RequestNavigatorSearchRooms from "../communication/outgoing/navigator/RequestNavigatorSearchRooms";
import RequestNavigatorPopularRooms from "../communication/outgoing/navigator/RequestNavigatorPopularRooms";
import RequestNavigatorOwnRooms from "../communication/outgoing/navigator/RequestNavigatorOwnRooms";
import RequestNavigatorLeaveRoom from "../communication/outgoing/navigator/RequestNavigatorLeaveRoom";
import RequestNavigatorGoToRoom from "../communication/outgoing/navigator/RequestNavigatorGoToRoom";
import RoomData from "./RoomData";
import RequestNavigatorCreateRoom from "../communication/outgoing/navigator/RequestNavigatorCreateRoom";

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
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorGoToRoom(roomId));
    }

    requestLeaveRoom() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorLeaveRoom());
    }

    handleRoomDataList(data: RoomData[]) {
        BobbaEnvironment.getGame().uiManager.onLoadRoomList(data);
    }

    handleCurrentRoomData(data: RoomData) {
        BobbaEnvironment.getGame().uiManager.onCurrentRoomDataLoad(data);
    }

    requestCreateRoom(roomName: string, modelId: string) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestNavigatorCreateRoom(roomName, modelId));
    }
}
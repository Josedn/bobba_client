import IMessageHandler from "../net/IMessageHandler";
import WebSocketClient from "../net/WebSocketClient";
import BobbaEnvironment from "../BobbaEnvironment";
import IIncomingEvent from "./incoming/IIncomingEvent";
import { LOGIN_OK, ROOM_DATA_HEIGHTMAP, ROOM_ITEM_DATA, PLAYERS_DATA, PLAYER_STATUS, PLAYER_REMOVE, CHAT, PLAYER_WAVE, ITEM_REMOVE, ITEM_STATE, WALL_ITEM_DATA, INVENTORY_ITEMS, INVENTORY_ITEM_REMOVE, CATALOGUE_INDEX, CATALOGUE_PAGE, CATALOGUE_PURCHASE_ERROR, CATALOGUE_PURCHASE_INFO, CREDITS_BALANCE, ROOM_DATA_MODEL_INFO, ROOM_DATA, NAVIGATOR_ROOM_LIST, NAVIGATOR_LEAVE_ROOM, MESSENGER_FRIENDS, MESSENGER_MESSAGE, MESSENGER_REQUESTS, MESSENGER_SEARCH_RESULT, MESSENGER_UPDATE_FRIEND } from "./protocol/OpCodes/ServerOpCodes";
import HandleLoginOk from "./incoming/generic/HandleLoginOk";
import ServerMessage from "./protocol/ServerMessage";
import ClientMessage from "./protocol/ClientMessage";
import HandleFloorItems from "./incoming/rooms/HandleFloorItems";
import HandleRoomUsers from "./incoming/rooms/HandleRoomUsers";
import HandleRoomUserStatus from "./incoming/rooms/HandleRoomUserStatus";
import HandleRoomUserRemove from "./incoming/rooms/HandleRoomUserRemove";
import HandleIncomingChat from "./incoming/rooms/HandleIncomingChat";
import HandleRoomUserWave from "./incoming/rooms/HandleRoomUserWave";
import HandleRoomItemRemove from "./incoming/rooms/HandleRoomItemRemove";
import HandleRoomItemState from "./incoming/rooms/HandleRoomItemState";
import HandleWallItems from "./incoming/rooms/HandleWallItems";
import HandleInventoryItems from "./incoming/generic/HandleInventoryItems";
import HandleInventoryItemRemove from "./incoming/generic/HandleInventoryItemRemove";
import HandleCatalogueIndex from "./incoming/catalogue/HandleCatalogueIndex";
import HandleCataloguePage from "./incoming/catalogue/HandleCataloguePage";
import HandleCataloguePurchaseError from "./incoming/catalogue/HandleCataloguePurchaseError";
import HandleCataloguePurchaseInformation from "./incoming/catalogue/HandlePurchaseCatalogueInformation";
import HandleUpdateCreditsBalance from "./incoming/generic/HandleUpdateCreditsBalance";
import HandleHeightMap from "./incoming/roomdata/HandleHeightMap";
import HandleRoomModelInfo from "./incoming/roomdata/HandleRoomModelInfo";
import HandleRoomData from "./incoming/roomdata/HandleRoomData";
import HandleRoomList from "./incoming/navigator/HandleRoomList";
import HandleLeaveRoom from "./incoming/navigator/HandleLeaveRoom";
import HandleMessengerFriends from "./incoming/messenger/HandleMessengerFriends";
import HandleMessengerMessage from "./incoming/messenger/HandleMessengerMessage";
import HandleMessengerRequests from "./incoming/messenger/HandleMessengerRequests";
import HandleMessengerSearchResult from "./incoming/messenger/HandleMessengerSearchResult";
import HandleMessengerUpdateFriend from "./incoming/messenger/HandleMessengerUpdateFriend";

export default class CommunicationManager implements IMessageHandler {
    client: WebSocketClient;
    requestHandlers: IncomingEventDictionary;

    constructor() {
        this.client = new WebSocketClient(this);
        this.requestHandlers = {};
        this._registerRequests();
    }

    _registerRequests() {
        this.requestHandlers[LOGIN_OK] = new HandleLoginOk();
        this.requestHandlers[ROOM_DATA_HEIGHTMAP] = new HandleHeightMap();
        this.requestHandlers[PLAYERS_DATA] = new HandleRoomUsers();
        this.requestHandlers[PLAYER_STATUS] = new HandleRoomUserStatus();
        this.requestHandlers[PLAYER_REMOVE] = new HandleRoomUserRemove();
        this.requestHandlers[CHAT] = new HandleIncomingChat();
        this.requestHandlers[PLAYER_WAVE] = new HandleRoomUserWave();
        this.requestHandlers[ROOM_ITEM_DATA] = new HandleFloorItems();
        this.requestHandlers[ITEM_REMOVE] = new HandleRoomItemRemove();
        this.requestHandlers[ITEM_STATE] = new HandleRoomItemState();
        this.requestHandlers[WALL_ITEM_DATA] = new HandleWallItems();
        this.requestHandlers[INVENTORY_ITEMS] = new HandleInventoryItems();
        this.requestHandlers[INVENTORY_ITEM_REMOVE] = new HandleInventoryItemRemove();
        this.requestHandlers[CATALOGUE_INDEX] = new HandleCatalogueIndex();
        this.requestHandlers[CATALOGUE_PAGE] = new HandleCataloguePage();
        this.requestHandlers[CATALOGUE_PURCHASE_ERROR] = new HandleCataloguePurchaseError();
        this.requestHandlers[CATALOGUE_PURCHASE_INFO] = new HandleCataloguePurchaseInformation();
        this.requestHandlers[CREDITS_BALANCE] = new HandleUpdateCreditsBalance();
        this.requestHandlers[ROOM_DATA_MODEL_INFO] = new HandleRoomModelInfo();
        this.requestHandlers[ROOM_DATA] = new HandleRoomData();
        this.requestHandlers[NAVIGATOR_ROOM_LIST] = new HandleRoomList();
        this.requestHandlers[NAVIGATOR_LEAVE_ROOM] = new HandleLeaveRoom();
        this.requestHandlers[MESSENGER_FRIENDS] = new HandleMessengerFriends();
        this.requestHandlers[MESSENGER_MESSAGE] = new HandleMessengerMessage();
        this.requestHandlers[MESSENGER_REQUESTS] = new HandleMessengerRequests();
        this.requestHandlers[MESSENGER_SEARCH_RESULT] = new HandleMessengerSearchResult();
        this.requestHandlers[MESSENGER_UPDATE_FRIEND] = new HandleMessengerUpdateFriend();
    }

    sendMessage(message: ClientMessage) {
        if (this.client.connected) {
            //console.log('Sent [' + message.id + ']: ' + message.constructor.name);
            this.client.send(message.body);
        }
    }

    handleMessage = (rawMessage: string): void => {
        const message = new ServerMessage(rawMessage);
        const handler = this.requestHandlers[message.id];
        if (handler == null) {
            //console.log('No handler for: ' + message.id);
        } else {
            //console.log('Handled [' + message.id + ']: ' + handler.constructor.name);
            handler.handle(message);
        }
    }

    handleOpenConnection = (): void => {
        BobbaEnvironment.getGame().uiManager.log("Connected!!1");
    }

    handleCloseConnection = (): void => {
        BobbaEnvironment.getGame().stop();
    }

    handleConnectionError = (): void => {

    }

    connect(connectionURL: string): Promise<void> {
        return this.client.connect(connectionURL);
    }
}

interface IncomingEventDictionary {
    [id: number]: IIncomingEvent;
}
import RoomModel from "./RoomModel";
import RoomEngine from "./RoomEngine";
import RoomUserManager from "./users/RoomUserManager";
import RoomItemManager from "./items/RoomItemManager";
import ChatManager from "./chats/ChatManager";
import BobbaEnvironment from "../BobbaEnvironment";
import RequestChat from "../communication/outgoing/rooms/RequestChat";
import RequestWave from "../communication/outgoing/rooms/RequestWave";

export default class Room {
    model: RoomModel;
    engine: RoomEngine;
    roomUserManager: RoomUserManager;
    roomItemManager: RoomItemManager;
    chatManager: ChatManager;

    constructor(model: RoomModel) {
        this.model = model;
        this.engine = new RoomEngine(this);
        this.roomUserManager = new RoomUserManager(this);
        this.roomItemManager = new RoomItemManager(this);
        this.chatManager = new ChatManager(this);
        this.engine.setChatContainer(this.chatManager.container);
    }

    chat(chat: string) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestChat(chat));
    }

    wave() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestWave());
    }

    tick(delta: number) {
        this.engine.tick(delta);
        this.roomUserManager.tick(delta);
        this.roomItemManager.tick(delta);
        this.chatManager.tick(delta);
    }

    dispose() {
        this.engine.getStage().visible = false;
        this.engine.getStage().removeChild();
    }
}
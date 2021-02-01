import Room from "./rooms/Room";
import MainEngine from './graphics/MainEngine';
import AvatarImager from "./imagers/avatars/AvatarImager";
import FurniImager from "./imagers/furniture/FurniImager";
import BaseItemManager from "./items/BaseItemManager";
import { ROOM_SELECTED_TILE, ROOM_TILE_SHADOW, FLOOR_ITEM_PLACEHOLDER, WALL_ITEM_PLACEHOLDER } from "./graphics/GenericSprites";
import AvatarContainer, { GHOST_LOOK } from "./rooms/users/AvatarContainer";
import CommunicationManager from "./communication/CommunicationManager";
import RoomModel from "./rooms/RoomModel";
import RequestRoomData from "./communication/outgoing/roomdata/RequestRoomData";
import ChatImager from "./imagers/bubbles/ChatImager";
import MeMenuImager from "./imagers/bubbles/MeMenuImager";
import UIManager from "./ui/UIManager";
import UserManager from "./users/UserManager";
import Inventory from "./inventory/Inventory";
import RequestInventoryItems from "./communication/outgoing/users/RequestInventoryItems";
import Catalogue from "./catalogue/Catalogue";
import RequestCatalogueIndex from "./communication/outgoing/catalogue/RequestCatalogueIndex";
import SoundManager from "./sound/SoundManager";
import Nav from "./navigator/Nav";
import RequestHeightMap from "./communication/outgoing/roomdata/RequestHeightMap";
import RequestNavigatorGoToRoom from "./communication/outgoing/navigator/RequestNavigatorGoToRoom";
import RoomImager from "./imagers/rooms/RoomImager";
import Messenger from "./messenger/Messenger";
import RequestMessengerLoadFriends from "./communication/outgoing/messenger/RequestMessengerLoadFriends";
import Constants from "../Constants";

export default class Game {
    currentRoom?: Room;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    chatImager: ChatImager;
    meMenuImager: MeMenuImager;
    roomImager: RoomImager;
    baseItemManager: BaseItemManager;
    userManager: UserManager;
    ghostTextures: AvatarContainer;
    communicationManager: CommunicationManager;
    inventory: Inventory;
    catalogue: Catalogue;
    navigator: Nav;
    messenger: Messenger;
    uiManager: UIManager;
    soundManager: SoundManager;
    isStarting: boolean;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.soundManager = new SoundManager();
        this.ghostTextures = new AvatarContainer(GHOST_LOOK, true);
        this.avatarImager = new AvatarImager(Constants.AVATAR_RESOURCES_URL);
        this.furniImager = new FurniImager(Constants.FURNI_RESOURCES_URL);
        this.chatImager = new ChatImager();
        this.roomImager = new RoomImager();
        this.meMenuImager = new MeMenuImager();
        this.userManager = new UserManager();
        this.baseItemManager = new BaseItemManager(this.furniImager);
        this.communicationManager = new CommunicationManager();
        this.inventory = new Inventory();
        this.catalogue = new Catalogue();
        this.navigator = new Nav();
        this.messenger = new Messenger();
        this.uiManager = new UIManager(this);
        this.isStarting = false;
    }

    loadGame(): Promise<void> {
        this.isStarting = true;
        const sprites: string[] = [
            ROOM_SELECTED_TILE,
            FLOOR_ITEM_PLACEHOLDER,
            WALL_ITEM_PLACEHOLDER,
            ROOM_TILE_SHADOW
        ];
        this.uiManager.postLoading("Initializing game engine");
        return Promise.all([
            this.avatarImager.initialize().then(() => this.ghostTextures.initialize()),
            this.furniImager.initialize(),
            this.chatImager.initialize(),
            this.meMenuImager.initialize(),
            this.roomImager.initialize(),
            this.engine.loadGlobalTextures(sprites),
        ]).then(() => {
            this.uiManager.postLoading("Connecting to server");
            return this.communicationManager.connect(Constants.WS_URL);
        });
    }

    handleUserData(id: number, name: string, look: string, motto: string) {
        this.uiManager.onSetUserData(this.userManager.setCurrentUser(id, name, motto, look));
        if (this.currentRoom == null) {
            this.uiManager.log("Logged in!");
            this.communicationManager.sendMessage(new RequestInventoryItems());
            this.communicationManager.sendMessage(new RequestCatalogueIndex());
            this.communicationManager.sendMessage(new RequestMessengerLoadFriends());
            this.soundManager.playPixelsSound();

            this.uiManager.doOpenNavigator();
            this.uiManager.doRequestOpenMessenger();
            this.uiManager.onCloseRoomInfo();

            this.communicationManager.sendMessage(new RequestNavigatorGoToRoom(-1));
        }
    }

    handleRoomModelInfo(modelId: string, roomId: number) {
        this.communicationManager.sendMessage(new RequestHeightMap());
    }

    handleHeightMap(model: RoomModel) {
        this.unloadRoom();
        this.engine.onEnterRoom();

        this.currentRoom = new Room(model);
        this.engine.getLogicStage().addChild(this.currentRoom.engine.getLogicStage());
        this.engine.getMainStage().addChild(this.currentRoom.engine.getStage());
        this.uiManager.log("Loaded heightmap");
        this.uiManager.onCloseNavigator();
        this.uiManager.onCloseCreateRoom();
        this.uiManager.onCloseCatalogue();
        this.uiManager.onCloseInventory();
        this.uiManager.onCloseChangeLooks();
        this.communicationManager.sendMessage(new RequestRoomData());
    }

    unloadRoom() {
        if (this.currentRoom != null) {
            this.currentRoom.dispose();
            this.engine.onLeaveRoom();
            this.uiManager.onCloseSelectFurni(-1);
            this.uiManager.onCloseSelectUser(-1);
            this.uiManager.onCloseRoomInfo();
            this.uiManager.doOpenNavigator();
        }
        this.currentRoom = undefined;
    }

    onMouseMove = (x: number, y: number, isMouseDragging: boolean) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseMovement(x, y, isMouseDragging);
        }
    }

    onTouchStart = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleTouchStart(x, y);
        }
    }

    onTouchMove = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleTouchMove(x, y);
        }
    }

    onMouseClick = (x: number, y: number, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseClick(x, y, shiftKey, ctrlKey, altKey, true);
        }
    }

    onMouseDoubleClick = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseDoubleClick(x, y);
        }
    }

    onResize = () => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.onResize();
        }
    }

    gameLoop = (delta: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.tick(delta * (1 / 60) * 1000);
        }
    }

    stop() {
        this.unloadRoom();
        this.uiManager.onGameStop();
        console.log("Stopping game...");
    }
}
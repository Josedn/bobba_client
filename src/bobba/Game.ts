import Room from "./rooms/Room";
import MainEngine from './graphics/MainEngine';
import AvatarImager from "./imagers/avatars/AvatarImager";
import FurniImager from "./imagers/furniture/FurniImager";
import BaseItemManager from "./items/BaseItemManager";
import { ROOM_TILE, ROOM_SELECTED_TILE, ROOM_WALL_L, ROOM_WALL_R, ROOM_WALL_DOOR_EXTENDED_L, ROOM_TILE_SHADOW, FLOOR_ITEM_PLACEHOLDER, WALL_ITEM_PLACEHOLDER } from "./graphics/GenericSprites";
import AvatarContainer, { GHOST_LOOK } from "./rooms/users/AvatarContainer";
import CommunicationManager from "./communication/CommunicationManager";
import Login from "./communication/outgoing/generic/Login";
import RequestMap from "./communication/outgoing/rooms/RequestMap";
import RoomModel from "./rooms/RoomModel";
import RequestRoomData from "./communication/outgoing/rooms/RequestRoomData";
import ChatImager from "./imagers/bubbles/ChatImager";
import MeMenuImager from "./imagers/bubbles/MeMenuImager";

export default class Game {
    currentRoom?: Room;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    chatImager: ChatImager;
    meMenuImager: MeMenuImager;
    baseItemManager: BaseItemManager;
    ghostTextures: AvatarContainer;
    communicationManager: CommunicationManager;
    isStarting: boolean;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.ghostTextures = new AvatarContainer(GHOST_LOOK, true);
        this.avatarImager = new AvatarImager();
        this.furniImager = new FurniImager();
        this.chatImager = new ChatImager();
        this.meMenuImager = new MeMenuImager();
        this.baseItemManager = new BaseItemManager(this.furniImager);
        this.communicationManager = new CommunicationManager();
        this.isStarting = false;
    }

    loadGame(): Promise<any> {
        this.isStarting = true;
        const sprites: string[] = [
            ROOM_TILE,
            ROOM_SELECTED_TILE,
            FLOOR_ITEM_PLACEHOLDER,
            WALL_ITEM_PLACEHOLDER,
            ROOM_WALL_L,
            ROOM_WALL_R,
            ROOM_WALL_DOOR_EXTENDED_L,
            ROOM_TILE_SHADOW
        ];

        return Promise.all([
            this.avatarImager.initialize().then(() => this.ghostTextures.initialize()),
            this.furniImager.initialize(),
            this.chatImager.initialize(),
            this.meMenuImager.initialize(),
            this.engine.loadGlobalTextures(sprites),
            this.communicationManager.connect("localhost", 443, false),
        ]);
    }

    doLogin(username: string, look: string) {
        this.communicationManager.sendMessage(new Login(username, look));
    }

    handleLoggedIn() {
        console.log("Logged in!");
        this.communicationManager.sendMessage(new RequestMap());
    }

    loadRoom(id: number, name: string, model: RoomModel) {
        this.currentRoom = new Room(id, name, model);
        this.engine.getLogicStage().addChild(this.currentRoom.engine.getLogicStage());
        this.engine.getMainStage().addChild(this.currentRoom.engine.getStage());
        console.log("Loaded room: " + name);
        this.communicationManager.sendMessage(new RequestRoomData());
    }

    unloadRoom() {
        if (this.currentRoom != null) {
            this.currentRoom.dispose();
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

    onMouseClick = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseClick(x, y);
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
        console.log("Stopping game...");
    }
}
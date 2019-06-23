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
import ChatImager from "./imagers/chats/ChatImager";

export default class Game {
    currentRoom?: Room;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    chatImager: ChatImager;
    baseItemManager: BaseItemManager;
    ghostTextures: AvatarContainer;
    communicationManager: CommunicationManager;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.ghostTextures = new AvatarContainer(GHOST_LOOK, true);
        this.avatarImager = new AvatarImager();
        this.furniImager = new FurniImager();
        this.chatImager = new ChatImager();
        this.baseItemManager = new BaseItemManager(this.furniImager);
        this.communicationManager = new CommunicationManager();

        this.loadGame();
    }

    loadGame() {
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

        Promise.all([
            this.avatarImager.initialize().then(() => this.ghostTextures.initialize()),
            this.furniImager.initialize(),
            this.chatImager.initialize(),
            this.engine.loadGlobalTextures(sprites),
            this.communicationManager.connect("localhost", 443, false),
        ]).then(() => {

            this.doLogin();

        }).catch(err => {
            console.log("Cannot start game: " + err);
        });
    }

    doLogin() {
        this.communicationManager.sendMessage(new Login('Relv', 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45'));
    }

    handleLoggedIn() {
        console.log("Logged in!");
        this.communicationManager.sendMessage(new RequestMap());
    }

    loadRoom(id: number, name: string, model: RoomModel) {
        this.currentRoom = new Room(id, name, model);
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
            /*const pixels = this.engine.pixiApp.renderer.extract.pixels(this.engine.getMainStage());

            const bounds = this.engine.getMainStage().getBounds();
            const stageX = x - bounds.x;
            const stageY = y - bounds.y;
            const pos = (stageY * bounds.width + stageX) * 4;
            if (stageX < 0 || stageX < 0 || stageX > bounds.width || stageY > bounds.height) {
                console.log("out of bounds");
            } else {
                const rgba = { r: pixels[pos], g: pixels[pos + 1], b: pixels[pos + 2], a: pixels[pos + 3] };
                console.log(rgba);
            }*/
            
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
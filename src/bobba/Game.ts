import Room from "./rooms/Room";
import MainEngine from './graphics/MainEngine';
import AvatarImager from "./imagers/avatars/AvatarImager";
import FurniImager from "./imagers/furniture/FurniImager";
import BaseItemManager from "./items/BaseItemManager";
import { ROOM_TILE, ROOM_SELECTED_TILE, FURNI_PLACEHOLDER, ROOM_WALL_L, ROOM_WALL_R, ROOM_WALL_DOOR_EXTENDED_L, ROOM_TILE_SHADOW } from "./graphics/GenericSprites";
import AvatarContainer, { GHOST_LOOK } from "./rooms/users/AvatarContainer";
import CommunicationManager from "./communication/CommunicationManager";
import Login from "./communication/outgoing/generic/Login";
import RequestMap from "./communication/outgoing/rooms/RequestMap";
import RoomModel from "./rooms/RoomModel";
import RequestRoomData from "./communication/outgoing/rooms/RequestRoomData";

export default class Game {
    currentRoom?: Room;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    baseItemManager: BaseItemManager;
    ghostTextures: AvatarContainer;
    communicationManager: CommunicationManager;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.ghostTextures = new AvatarContainer(GHOST_LOOK, true);
        this.avatarImager = new AvatarImager();
        this.furniImager = new FurniImager();
        this.baseItemManager = new BaseItemManager(this.furniImager);
        this.communicationManager = new CommunicationManager();

        this.loadGame();
    }

    loadGame() {
        const sprites: string[] = [
            ROOM_TILE,
            ROOM_SELECTED_TILE,
            FURNI_PLACEHOLDER,
            ROOM_WALL_L,
            ROOM_WALL_R,
            ROOM_WALL_DOOR_EXTENDED_L,
            ROOM_TILE_SHADOW
        ];

        Promise.all([
            this.avatarImager.initialize().then(() => this.ghostTextures.initialize()),
            this.furniImager.initialize(),
            this.engine.loadGlobalTextures(sprites)
        ]).then(() => this.communicationManager.connect("localhost", 443, false)).then(() => {

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
        console.log("Stopping game...");
    }
}
import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import AvatarImager from "./imagers/avatars/AvatarImager";
import { TextureDictionary, loadGhostTextures } from "./imagers/avatars/AvatarHelper";
//import PromiseQueue from "./misc/PromiseQueue";
import FurniImager from "./imagers/furniture/FurniImager";
import BaseItemManager from "./items/BaseItemManager";
import { ROOM_TILE, ROOM_SELECTED_TILE, FURNI_PLACEHOLDER } from "./graphics/GenericSprites";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    baseItemManager: BaseItemManager;
    ghostTextures: TextureDictionary | null;
    //promiseQueue: PromiseQueue;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.currentRoom = null;
        this.ghostTextures = null;
        //this.promiseQueue = new PromiseQueue();
        this.avatarImager = new AvatarImager();
        this.furniImager = new FurniImager();
        this.baseItemManager = new BaseItemManager(this.furniImager);

        this.loadGame();
    }

    loadGame() {
        const sprites: string[] = [
            ROOM_TILE,
            ROOM_SELECTED_TILE,
            FURNI_PLACEHOLDER,
        ];

        Promise.all([
            this.avatarImager.initialize(),
            this.furniImager.initialize(),
            this.engine.loadGlobalTextures(sprites)
        ]).then(() => {
            loadGhostTextures(this.avatarImager, this.engine).then(ghostTextures => {
                this.ghostTextures = ghostTextures;
                this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
                this.currentRoom.roomUserManager.addUserToRoom(1, 4, 8, 0, 0, "Relv", "hd-190-10.lg-3023-1408.ch-215-91.hr-893-45");
                this.currentRoom.roomUserManager.addUserToRoom(2, 4, 10, 0, 4, "Grav", "ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10");
                this.currentRoom.roomItemManager.addItemToRoom(256, 4, 4, 0, 2, 0, 267);
                this.currentRoom.roomItemManager.addItemToRoom(257, 7, 6, 0, 2, 1, 1623);
                this.currentRoom.roomItemManager.addItemToRoom(258, 7, 4, 0, 0, 1, 1565);

                this.currentRoom.roomItemManager.addItemToRoom(259, 0, 0, 0, 2, 0, 4651);
                this.currentRoom.roomItemManager.addItemToRoom(260, 0, 1, 0, 2, 0, 4651);
                this.currentRoom.roomItemManager.addItemToRoom(261, 0, 2, 0, 2, 0, 4651);

                this.currentRoom.roomItemManager.addItemToRoom(262, 0, 0, 0, 4, 0, 4651);
                this.currentRoom.roomItemManager.addItemToRoom(263, 1, 0, 0, 4, 0, 4651);
                this.currentRoom.roomItemManager.addItemToRoom(264, 2, 0, 0, 4, 0, 4651);

                this.currentRoom.roomItemManager.addItemToRoom(265, 0, 5, 0, 0, 0, 173);

            });
        }).catch((err) => {
            console.log("Error loading game: " + err);
        });
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
            this.currentRoom.tick(delta);
        }
    }
}
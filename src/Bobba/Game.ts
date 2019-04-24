import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import GenericSprites from "./graphics/GenericSprites";
import AvatarImager from "./imagers/avatars/AvatarImager";
import { TextureDictionary, loadGhostTextures } from "./imagers/avatars/AvatarHelper";
import PromiseQueue from "./misc/PromiseQueue";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;
    avatarImager: AvatarImager;
    ghostTextures: TextureDictionary | null;
    promiseQueue: PromiseQueue;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.currentRoom = null;
        this.ghostTextures = null;
        this.promiseQueue = new PromiseQueue();
        this.avatarImager = new AvatarImager();
        this.loadGame();
    }

    loadGame() {
        const sprites: string[] = [
            GenericSprites.ROOM_TILE,
            GenericSprites.ROOM_SELECTED_TILE,
        ];

        Promise.all([
            this.avatarImager.initialize(),
            this.engine.loadResource(sprites)
        ]).then(() => {
            loadGhostTextures(this.avatarImager, this.engine).then(ghostTextures => {
                this.ghostTextures = ghostTextures;
                this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
                this.currentRoom.roomUserManager.addUserToRoom(1, 4, 4, 0, 2, "Relv", "hd-190-10.lg-3023-1408.ch-215-91.hr-893-45");
            });
        }).catch((err) => {
            console.log("Error loading game:" + err);
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
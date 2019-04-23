import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import GenericSprites from "./graphics/GenericSprites";
import AvatarImager from "./imagers/avatars/AvatarImager";
import AvatarInfo from "./imagers/avatars/AvatarInfo";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;
    avatarImager: AvatarImager;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.currentRoom = null;
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

            this.avatarImager.generateGeneric(new AvatarInfo("hd-190-10.lg-3023-1408.ch-215-91.hr-893-45", 2, 2, ["wlk"], "std", 2, false, "n"));

            this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
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
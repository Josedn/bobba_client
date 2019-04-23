import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import GenericSprites from "./graphics/GenericSprites";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;
    isMouseDragging: boolean;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize);
        this.currentRoom = null;
        this.isMouseDragging = false;
        this.loadGame();
        this.setMouseInteractions();
    }

    loadGame() {
        const sprites: string[] = [
            GenericSprites.ROOM_TILE,
            GenericSprites.ROOM_SELECTED_TILE,
        ];

        this.engine.loadResource(sprites, this.continueGameLoading);
    }

    onMouseMove = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseMovement(x, y, this.isMouseDragging);
        }
    }

    setMouseInteractions() {
        this.engine.pixiApp.view.addEventListener('mousemove', (evt) => {
            this.onMouseMove(evt.x, evt.y);
        }, false);
    }

    onResize = () => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.onResize();
        }
    }

    continueGameLoading = () => {
        this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
    }

    gameLoop = (delta: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.tick(delta);
        }
    }
}
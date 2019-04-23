import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import GenericSprites from "./graphics/GenericSprites";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;

    constructor() {
        this.engine = new MainEngine(this.gameLoop);
        this.currentRoom = null;
        this.loadGame();
    }

    loadGame() {
        const sprites: string[] = [
            GenericSprites.ROOM_TILE,
            GenericSprites.ROOM_SELECTED_TILE,
        ];

        PIXI.loader
            .add(sprites)
            .load(() => {
                this.continueGameLoading();
            });
    }

    continueGameLoading() {
        this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
    }

    gameLoop = (delta: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.tick(delta);
        }
    }
}
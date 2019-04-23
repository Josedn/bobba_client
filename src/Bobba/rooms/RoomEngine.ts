import Room from "./Room";
import GenericSprites from "../graphics/GenericSprites";
import { Sprite } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import MainEngine from "../graphics/MainEngine";
import RoomModel from "./RoomModel";

export default class RoomEngine {
    room: Room;
    cameraX: number;
    cameraY: number;
    constructor(room: Room) {
        this.room = room;
        this.cameraX = 0;
        this.cameraY = 0;
        this.resetCamera();
        this.setFloor();
    }

    resetCamera() {
        const model = this.room.model;
        this.cameraX = Math.round((MainEngine.getViewportWidth() - (GenericSprites.ROOM_TILE_WIDTH * (model.maxX - model.maxY + 3))) / 2);
        this.cameraY = Math.round((MainEngine.getViewportHeight() - ((model.maxX + model.maxY) * GenericSprites.ROOM_TILE_HEIGHT) + 114) / 2);
    }

    setFloor() {
        const floorTexture = PIXI.loader.resources[GenericSprites.ROOM_TILE].texture;
        const floorSprites = [];
        const model = this.room.model;
        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if (tile > 0) {
                    const currentSprite = new Sprite(floorTexture);
                    currentSprite.x = (i - j) * GenericSprites.ROOM_TILE_WIDTH + this.cameraX;
                    currentSprite.y = (i + j) * GenericSprites.ROOM_TILE_HEIGHT + this.cameraY;
                    floorSprites.push(currentSprite);
                    BobbaEnvironment.getGame().engine.getMainStage().addChild(currentSprite);
                }
            }
        }
    }

    tick(delta: number) {

    }
}
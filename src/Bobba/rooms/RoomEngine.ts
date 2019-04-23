import Room from "./Room";
import GenericSprites from "../graphics/GenericSprites";
import { Sprite } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import MainEngine from "../graphics/MainEngine";

export default class RoomEngine {
    room: Room;
    cameraX: number;
    cameraY: number;
    container: PIXI.particles.ParticleContainer;
    floorSprites: Sprite[];
    
    constructor(room: Room) {
        this.room = room;
        this.cameraX = 0;
        this.cameraY = 0;
        this.container = new PIXI.particles.ParticleContainer();
        this.floorSprites = [];
        this.resetCamera();
        this.setFloor();
        BobbaEnvironment.getGame().engine.getMainStage().addChild(this.container);
    }

    onResize() {
        this.resetCamera();
    }

    resetCamera() {
        const model = this.room.model;
        this.cameraX = Math.round((MainEngine.getViewportWidth() - (GenericSprites.ROOM_TILE_WIDTH * (model.maxX - model.maxY + 3))) / 2);
        this.cameraY = Math.round((MainEngine.getViewportHeight() - ((model.maxX + model.maxY) * GenericSprites.ROOM_TILE_HEIGHT) + 114) / 2);

        this.container.x = this.cameraX;
        this.container.y = this.cameraY;
    }

    setFloor() {
        const floorTexture = BobbaEnvironment.getGame().engine.getResource(GenericSprites.ROOM_TILE).texture;
        this.floorSprites = [];
        const model = this.room.model;
        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if (tile > 0) {
                    const currentSprite = new Sprite(floorTexture);
                    currentSprite.x = (i - j) * GenericSprites.ROOM_TILE_WIDTH;
                    currentSprite.y = (i + j) * GenericSprites.ROOM_TILE_HEIGHT;
                    this.floorSprites.push(currentSprite);
                    this.container.addChild(currentSprite);
                }
            }
        }
    }

    tick(delta: number) {

    }
}
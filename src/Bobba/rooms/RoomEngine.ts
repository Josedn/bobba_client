import Room from "./Room";
import GenericSprites from "../graphics/GenericSprites";
import { Sprite, Container, Point } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import MainEngine from "../graphics/MainEngine";

const CAMERA_CENTERED_OFFSET_X = 3;
const CAMERA_CENTERED_OFFSET_Y = 114;

export default class RoomEngine {
    room: Room;
    container: Container;
    floorSprites: Sprite[];
    selectedTileSprite: Sprite | null;

    constructor(room: Room) {
        this.room = room;
        this.container = new Container();
        this.floorSprites = [];
        this.selectedTileSprite = null;
        this.onResize();
        this.setFloor();
        this.setSelectedTile();
        BobbaEnvironment.getGame().engine.getMainStage().addChild(this.container);
    }

    onResize() {
        this.centerCamera();
    }

    centerCamera() {
        const model = this.room.model;
        this.container.x = Math.round((MainEngine.getViewportWidth() - (GenericSprites.ROOM_TILE_WIDTH * (model.maxX - model.maxY + CAMERA_CENTERED_OFFSET_X))) / 2);
        this.container.y = Math.round((MainEngine.getViewportHeight() - ((model.maxX + model.maxY) * GenericSprites.ROOM_TILE_HEIGHT) + CAMERA_CENTERED_OFFSET_Y) / 2);
    }

    setSelectedTile() {
        const floorTexture = BobbaEnvironment.getGame().engine.getResource(GenericSprites.ROOM_SELECTED_TILE).texture;
        this.selectedTileSprite = new Sprite(floorTexture);
        this.selectedTileSprite.x = 0;
        this.selectedTileSprite.y = 0;
        this.selectedTileSprite.visible = false;
        this.container.addChild(this.selectedTileSprite);
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
                    const localPos = this.tileToLocal(i, j);
                    currentSprite.x = localPos.x;
                    currentSprite.y = localPos.y;

                    currentSprite.interactive = true;

                    //sprite hitbox
                    /*currentSprite.anchor.set(0.5, 0.5);
                    currentSprite.on('click', (event) => {
                        console.log(event.target.x);
                        console.log(event.target.y);
                    });*/
                    this.floorSprites.push(currentSprite);
                    this.container.addChild(currentSprite);
                }
            }
        }
    }

    tileToLocal(x: number, y: number): Point {
        return new Point((x - y) * GenericSprites.ROOM_TILE_WIDTH, (x + y) * GenericSprites.ROOM_TILE_HEIGHT);
    }

    globalToTile(x: number, y: number): Point {
        const offsetX = this.container.x;
        const offsetY = this.container.y;

        const xminusy = (x - 32 - offsetX) / GenericSprites.ROOM_TILE_WIDTH;
        const xplusy = (y - offsetY) / GenericSprites.ROOM_TILE_HEIGHT;

        const tileX = Math.floor((xminusy + xplusy) / 2);
        const tileY = Math.floor((xplusy - xminusy) / 2);

        return new Point(tileX, tileY);
    }

    handleMouseMovement = (mouseX: number, mouseY: number, isDrag: boolean) => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        this.updateSelectedTile(x, y)
    }

    updateSelectedTile(tileX: number, tileY: number) {
        const model = this.room.model;
        const localPos = this.tileToLocal(tileX, tileY);
        if (this.selectedTileSprite != null) {
            this.selectedTileSprite.visible = model.isValidTile(tileX, tileY);
            this.selectedTileSprite.x = localPos.x;
            this.selectedTileSprite.y = localPos.y;
        }
    }

    tick(delta: number) {

    }
}
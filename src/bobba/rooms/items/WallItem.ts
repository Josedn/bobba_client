import RoomItem from "./RoomItem";
import { Direction, ItemType } from "../../imagers/furniture/FurniImager";
import Room from "../Room";
import { Sprite } from "pixi.js";
import { calculateZIndexWallItem } from "../RoomEngine";
import BobbaEnvironment from "../../BobbaEnvironment";
import { WALL_ITEM_PLACEHOLDER, WALL_ITEM_PLACEHOLDER_OFFSET_X, WALL_ITEM_PLACEHOLDER_OFFSET_Y } from "../../graphics/GenericSprites";
import RequestFurniMove from "../../communication/outgoing/rooms/RequestFurniMove";

export default class WallItem extends RoomItem {
    constructor(id: number, x: number, y: number, rot: Direction, state: number, baseId: number, room: Room) {
        const placeholder = new Sprite();
        placeholder.texture = BobbaEnvironment.getGame().engine.getTexture(WALL_ITEM_PLACEHOLDER);
        placeholder.x = WALL_ITEM_PLACEHOLDER_OFFSET_X;
        placeholder.y = WALL_ITEM_PLACEHOLDER_OFFSET_Y;
        if (rot === 4) {
            placeholder.scale.x = -1;
            placeholder.x = -WALL_ITEM_PLACEHOLDER_OFFSET_X;
        }
        super(id, x, y, 0, rot, state, baseId, room, placeholder);
    }

    updateSpritePosition() {
        for (let container of this.containers) {
            container.x = this._x;
            container.y = this._y;
        }

        for (let container of this.selectableContainers) {
            container.x = this._x;
            container.y = this._y;
        }
    }

    calculateZIndex(zIndex: number, layerIndex: number): number {
        return calculateZIndexWallItem(this.id, this._x, this._y, zIndex, layerIndex);
    }

    getItemType(): ItemType {
        return 'wallitem';
    }

    rotate() {

    }

    updatePosition(screenX: number, screenY: number, rot: Direction, notifyServer: boolean) {
        this._x = screenX;
        this._y = screenY;
        this.rot = rot;
        this.updateSpritePosition();
        this.updateTextures();
        if (notifyServer) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniMove(this.id, this._x, this._y, this.rot));
        }
    }
}
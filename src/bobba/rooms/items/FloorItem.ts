import RoomItem from "./RoomItem";
import { calculateZIndexFloorItem } from "../RoomEngine";
import { ItemType, Direction } from "../../imagers/furniture/FurniImager";
import Room from "../Room";
import { Sprite } from 'pixi.js-legacy';
import { FLOOR_ITEM_PLACEHOLDER, FLOOR_ITEM_PLACEHOLDER_OFFSET_X, FLOOR_ITEM_PLACEHOLDER_OFFSET_Y } from "../../graphics/GenericSprites";
import BobbaEnvironment from "../../BobbaEnvironment";
import RequestFurniMove from "../../communication/outgoing/rooms/RequestFurniMove";

export default class FloorItem extends RoomItem {
    constructor(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number, room: Room) {
        const placeholder = new Sprite();
        placeholder.texture = BobbaEnvironment.getGame().engine.getTexture(FLOOR_ITEM_PLACEHOLDER);
        placeholder.x = FLOOR_ITEM_PLACEHOLDER_OFFSET_X;
        placeholder.y = FLOOR_ITEM_PLACEHOLDER_OFFSET_Y;

        super(id, x, y, z, rot, state, baseId, room, placeholder);
    }

    updateSpritePosition() {
        const local = this.room.engine.tileToLocal(this._x, this._y, this._z);
        let x = local.x + DRAWING_OFFSET_X;
        let y = local.y + DRAWING_OFFSET_Y;
        if (this.drawAsIcon) {
            x = this._x;
            y = this._y;
        }
        for (let container of this.containers) {
            container.x = x;
            container.y = y;
        }

        for (let container of this.selectableContainers) {
            container.x = x;
            container.y = y;
        }
    }

    updatePosition(tileX: number, tileY: number, tileZ: number, rot: Direction, drawAsIcon: boolean) {
        this._x = tileX;
        this._y = tileY;
        this._z = tileZ;
        this.rot = rot;
        this.drawAsIcon = drawAsIcon;
        this.updateSpritePosition();
        this.updateTextures();
    }

    calculateZIndex(zIndex: number, layerIndex: number): number {
        return calculateZIndexFloorItem(this._x, this._y, this._z, zIndex, layerIndex)
    }

    getItemType(): ItemType {
        return ItemType.FloorItem;
    }

    rotate() {
        if (this.baseItem != null) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniMove(this.id, this._x, this._y, this.baseItem.calculateNextDirection(this.rot)));
        }
    }
}


const DRAWING_OFFSET_X = 32;
const DRAWING_OFFSET_Y = 16;
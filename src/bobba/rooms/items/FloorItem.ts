import RoomItem from "./RoomItem";
import BobbaEnvironment from "../../BobbaEnvironment";
import { Container } from "pixi.js";
import { calculateZIndexFloorItem } from "../RoomEngine";

export default class FloorItem extends RoomItem {
    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        for (let container of this.containers) {
            container.x = x + DRAWING_OFFSET_X;
            container.y = y + DRAWING_OFFSET_Y;
        }

    }

    loadBase(): Promise<Container[]> {
        return new Promise((resolve, reject) => {
            BobbaEnvironment.getGame().baseItemManager.getItem('roomitem', this.baseId).then(baseItem => {
                this.baseItem = baseItem;
                this.setAdditionalSprites();
                this.updateSpritePosition();
                resolve(this.containers);
            }).catch(err => {
                reject(err);
            });
        });
    }

    calculateZIndex(zIndex: number, layerIndex: number): number {
        return calculateZIndexFloorItem(this._x, this._y, this._z, zIndex, layerIndex)
    }
}


const DRAWING_OFFSET_X = 32;
const DRAWING_OFFSET_Y = 16;
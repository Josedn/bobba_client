import RoomItem from "./RoomItem";
import { Direction } from "../../imagers/furniture/FurniImager";
import Room from "../Room";
import BobbaEnvironment from "../../BobbaEnvironment";
import { Container } from "pixi.js";
import { calculateZIndexWallItem } from "../RoomEngine";

export default class WallItem extends RoomItem {
    constructor(id: number, x: number, y: number, rot: Direction, state: number, baseId: number, room: Room) {
        super(id, x, y, 0, rot, state, baseId, room);
    }

    updateSpritePosition() {
        for (let container of this.containers) {
            container.x = this._x;
            container.y = this._y;
        }
    }

    loadBase(): Promise<Container[]> {
        return new Promise((resolve, reject) => {
            BobbaEnvironment.getGame().baseItemManager.getItem('wallitem', this.baseId).then(baseItem => {
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
        return calculateZIndexWallItem(this.id, this._x, this._y, zIndex, layerIndex);
    }
}
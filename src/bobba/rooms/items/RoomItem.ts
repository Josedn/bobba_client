import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import { Container, Sprite } from "pixi.js";
import BaseItem from "../../items/BaseItem";
import BobbaEnvironment from "../../BobbaEnvironment";

export default class RoomItem {
    id: number;
    _x: number;
    _y: number;
    _z: number;
    rot: Direction;

    baseId: number;
    sprites: Sprite[];
    baseItem: BaseItem | null;
    container: Container;
    loaded: boolean;

    room: Room;

    constructor(id: number, x: number, y: number, z: number, rot: Direction, baseId: number, room: Room) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.baseId = baseId;
        this.baseItem = null;
        this.room = room;

        this.loaded = false;
        this.sprites = [];
        this.container = new Container();

        this.updateSpritePosition();
        this.loadBase();
    }

    get x(): number {
        return this._x;
    }
    set x(value: number) {
        this._x = value;
        this.updateSpritePosition();
    }

    get y(): number {
        return this._y;
    }
    set y(value: number) {
        this._y = value;
        this.updateSpritePosition();
    }

    get z(): number {
        return this._z;
    }
    set z(value: number) {
        this._z = value;
        this.updateSpritePosition();
    }

    updateTextures() {
        if (this.baseItem == null) {

            //this.sprite.texture = this.texture;
        } else {

        }
    }

    tick(delta: number) {

    }

    setSprites() {
        if (this.baseItem != null) {
            for (let layer of this.baseItem.furniBase.getLayers(this.rot, 0, 0)) {
                const texture = this.baseItem.getTexture(layer.resourceName);
                if (texture != null) {
                    const sprite = new Sprite(texture);
                    sprite.x = -layer.asset.x;
                    sprite.y = -layer.asset.y;

                    this.container.addChild(sprite);
                }
            }
            
        }
    }

    loadBase() {
        BobbaEnvironment.getGame().baseItemManager.getItem('roomitem', this.baseId).then(baseItem => {
            this.baseItem = baseItem;
            this.setSprites();
        }).catch(err => {
            console.log("Error with item: " + err);
        });
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        this.container.x = x + 0;
        this.container.y = y + 0;
    }

    handleClick() {
        console.log("click on furni");
    }
}
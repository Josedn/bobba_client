import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import { Sprite, Texture } from "pixi.js";
import GenericSprites from "../../graphics/GenericSprites";
import BobbaEnvironment from "../../BobbaEnvironment";
import FurniBase from "../../imagers/furniture/FurniBase";

export default class RoomItem {
    id: number;
    _x: number;
    _y: number;
    _z: number;
    rot: Direction;

    baseId: number;
    base: FurniBase | null;
    sprite: Sprite;
    loaded: boolean;
    texture: Texture;

    room: Room;

    constructor(id: number, x: number, y: number, z: number, rot: Direction, baseId: number, room: Room) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.baseId = baseId;
        this.base = null;
        this.room = room;

        this.loaded = false;
        this.sprite = new Sprite();
        this.sprite.interactive = true;
        this.sprite.on('click', (event) => this.handleClick());
        this.texture = BobbaEnvironment.getGame().engine.getResource(GenericSprites.FURNI_PLACEHOLDER).texture;
        this.updateTexture();
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

    updateTexture() {
        if (this.texture != null)
            this.sprite.texture = this.texture;
    }

    tick(delta: number) {

    }

    loadBase() {
        BobbaEnvironment.getGame().furniImager._loadItemBase('roomitem', 13, 64).then(furniBase => {
            this.base = furniBase;
        });
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        this.sprite.x = x + 0;
        this.sprite.y = y + 0;
    }

    handleClick() {
        console.log("click on furni");
    }
}
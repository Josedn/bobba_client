import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import { Container, Sprite, BLEND_MODES } from "pixi.js";
import BaseItem from "../../items/BaseItem";
import BobbaEnvironment from "../../BobbaEnvironment";

const FRAME_SPEED = 5;

export default class RoomItem {
    id: number;
    _x: number;
    _y: number;
    _z: number;
    _state: number;
    rot: Direction;
    _frame: number;
    _frameCounter: number;

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
        this._state = 0;
        this.rot = rot;
        this.baseId = baseId;
        this.baseItem = null;
        this.room = room;

        this._frame = 0;
        this._frameCounter = 0;

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

    _nextPrivateFrame() {
        this._frame++;
        this.setSprites();
    }

    tick(delta: number) {
        this._frameCounter += delta;
        if (this._frameCounter >= FRAME_SPEED) {
            this._nextPrivateFrame();
            this._frameCounter = 0;
        }
    }

    setSprites() {
        this.container.removeChildren();
        if (this.baseItem != null) {
            let actualState = 0;
            let actualFrame = 0;
            if (this.baseItem.furniBase.states[this._state] != null) {
                actualState = this._state;
                actualFrame = this._frame % this.baseItem.furniBase.states[this._state].count;
            }
            for (let layer of this.baseItem.furniBase.getLayers(this.rot, actualState, actualFrame)) {

                const texture = this.baseItem.getTexture(layer.resourceName);
                if (texture != null) {
                    const sprite = new Sprite(texture);

                    sprite.x = -layer.asset.x;
                    sprite.y = -layer.asset.y;

                    if (layer.asset.isFlipped) {
                        sprite.x = layer.asset.x;
                        sprite.scale.x = -1;
                    }

                    if (layer.ink != null) {
                        if (layer.ink === 'ADD') {
                            sprite.blendMode = BLEND_MODES.ADD;
                        }
                    }

                    if (layer.alpha != null) {
                        sprite.alpha = layer.alpha / 255;
                    }

                    if (layer.color != null) {
                        sprite.tint = layer.color;
                    }

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
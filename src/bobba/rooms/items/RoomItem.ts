import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import { Container, Sprite, BLEND_MODES } from "pixi.js";
import BaseItem from "../../items/BaseItem";
import BobbaEnvironment from "../../BobbaEnvironment";
import { FURNI_PLACEHOLDER, FURNI_PLACEHOLDER_OFFSET_X, FURNI_PLACEHOLDER_OFFSET_Y } from "../../graphics/GenericSprites";

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

    constructor(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number, room: Room) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this._state = state;
        this.rot = rot;
        this.baseId = baseId;
        this.baseItem = null;
        this.room = room;

        this._frame = 0;
        this._frameCounter = 0;

        this.loaded = false;
        this.container = new Container();

        const placeholderSprite = new Sprite(BobbaEnvironment.getGame().engine.getResource(FURNI_PLACEHOLDER).texture);
        placeholderSprite.x = FURNI_PLACEHOLDER_OFFSET_X;
        placeholderSprite.y = FURNI_PLACEHOLDER_OFFSET_Y;

        this.container.addChild(placeholderSprite);
        this.sprites = [placeholderSprite];
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
        this.updateTextures();
    }

    tick(delta: number) {
        this._frameCounter += delta;
        if (this._frameCounter >= FRAME_SPEED) {
            this._nextPrivateFrame();
            this._frameCounter = 0;
        }
    }

    setAdditionalSprites() {
        if (this.baseItem != null) {
            const layerCount = parseInt(this.baseItem.furniBase.offset.visualization[this.baseItem.furniBase.size].layerCount) + 1;

            for (let i = 1; i < layerCount; i++) {
                const sprite = new Sprite();
                sprite.visible = false;
                sprite.interactive = true;
                sprite.on('click', this.handleClick);
                this.sprites.push(sprite);
                this.container.addChild(sprite);
            }
            this.updateTextures();
        }
    }

    updateTextures() {
        if (this.baseItem != null) {
            let actualState = 0;
            let actualFrame = 0;
            let layerIndex = 0;
            if (this.baseItem.furniBase.states[this._state] != null) {
                actualState = this._state;
                actualFrame = this._frame % this.baseItem.furniBase.states[this._state].count;
            }
            for (let layer of this.baseItem.furniBase.getLayers(this.rot, actualState, actualFrame)) {
                const texture = this.baseItem.getTexture(layer.resourceName);
                if (texture != null) {
                    const sprite = this.sprites[layerIndex++];

                    sprite.texture = texture;
                    sprite.visible = true;

                    sprite.x = -layer.asset.x;
                    sprite.y = -layer.asset.y;

                    if (layer.asset.isFlipped) {
                        sprite.x = layer.asset.x;
                        sprite.scale.x = -1;
                    } else {
                        sprite.scale.x = 1;
                    }

                    if (layer.ink != null && layer.ink === 'ADD') {
                        sprite.blendMode = BLEND_MODES.ADD;
                    } else {
                        sprite.blendMode = BLEND_MODES.NORMAL;
                    }

                    if (layer.alpha != null) {
                        sprite.alpha = layer.alpha / 255;
                    } else {
                        sprite.alpha = 1.0;
                    }

                    if (layer.color != null) {
                        sprite.tint = layer.color;
                    } else {
                        sprite.tint = 0xFFFFFF;
                    }
                }
            }
            for (let i = layerIndex; i < this.sprites.length; i++) {
                this.sprites[i].visible = false;
            }
        }
    }

    loadBase() {
        BobbaEnvironment.getGame().baseItemManager.getItem('roomitem', this.baseId).then(baseItem => {
            this.baseItem = baseItem;
            this.setAdditionalSprites();
        }).catch(err => {
            console.log("Error with item: " + err);
        });
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        this.container.x = x + DRAWING_OFFSET_X;
        this.container.y = y + DRAWING_OFFSET_Y;
    }

    handleClick = (event: any) => {
        if (this._state === 0) {
            this._state = 1;
        } else {
            this._state = 0;
        }
        this.updateTextures();
        console.log("click on furni");
    }
}

const DRAWING_OFFSET_X = 32;
const DRAWING_OFFSET_Y = 16;
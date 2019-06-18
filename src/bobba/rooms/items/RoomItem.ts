import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import { Container, Sprite, BLEND_MODES } from "pixi.js";
import BaseItem from "../../items/BaseItem";
import BobbaEnvironment from "../../BobbaEnvironment";
import { FURNI_PLACEHOLDER, FURNI_PLACEHOLDER_OFFSET_X, FURNI_PLACEHOLDER_OFFSET_Y } from "../../graphics/GenericSprites";
import RequestFurniInteract from "../../communication/outgoing/rooms/RequestFurniInteract";

const FRAME_SPEED = 100;

export default abstract class RoomItem {
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
    containers: Container[];
    baseItem: BaseItem | null;
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

        const placeholderContainer = new Container();
        const placeholderSprite = new Sprite(BobbaEnvironment.getGame().engine.getTexture(FURNI_PLACEHOLDER));

        placeholderSprite.x = FURNI_PLACEHOLDER_OFFSET_X;
        placeholderSprite.y = FURNI_PLACEHOLDER_OFFSET_Y;
        placeholderContainer.zIndex = this.calculateZIndex(0, 0);

        this.sprites = [placeholderSprite];
        this.containers = [placeholderContainer];
        this.containers[0].addChild(placeholderSprite);
        this.updateSpritePosition();
    }

    _nextPrivateFrame() {
        this._frame++;
        this.updateTextures();
    }

    setState(state: number) {
        this._state = state;
        this.updateTextures(); // ??????????????
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
                sprite.on('click', this.handleClick); // DOUBLE CLICK ??????

                const currentContainer = new Container();
                currentContainer.addChild(sprite);

                this.sprites.push(sprite);
                this.containers.push(currentContainer);
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
                    const sprite = this.sprites[layerIndex];
                    const zIndex = layer.z || 0;

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
                    this.containers[layerIndex].zIndex = this.calculateZIndex(zIndex, layerIndex);
                    layerIndex++;
                }
            }
            for (let i = layerIndex; i < this.sprites.length; i++) {
                this.sprites[i].visible = false;
            }
        }
    }

    abstract calculateZIndex(zIndex: number, layerIndex: number): number;

    abstract loadBase(): Promise<Container[]>;

    abstract updateSpritePosition(): void;

    handleClick = (event: any) => {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniInteract(this.id));
    }
}

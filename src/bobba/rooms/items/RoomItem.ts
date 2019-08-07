import Room from "../Room";
import { Container, Sprite, BLEND_MODES } from 'pixi.js-legacy';
import BaseItem from "../../items/BaseItem";
import BobbaEnvironment from "../../BobbaEnvironment";
import RequestFurniInteract from "../../communication/outgoing/rooms/RequestFurniInteract";
import { ItemType, Direction } from "../../imagers/furniture/FurniImager";
import { Selectable } from "../RoomEngine";
import RequestFurniPickUp from "../../communication/outgoing/rooms/RequestFurniPickUp";

const FRAME_SPEED = 100;

export default abstract class RoomItem implements Selectable {
    id: number;
    _x: number;
    _y: number;
    _z: number;
    _state: number;
    _nextState: number;
    rot: Direction;
    _frame: number;
    _frameCounter: number;
    baseId: number;
    sprites: Sprite[];
    selectableSprites: Sprite[];
    containers: Container[];
    selectableContainers: Container[];
    baseItem: BaseItem | null;
    loaded: boolean;
    drawAsIcon: boolean;

    colorId: number;

    room: Room;

    constructor(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number, room: Room, placeholderSprite: Sprite) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this._state = state;
        this._nextState = -1;
        this.rot = rot;
        this.baseId = baseId;
        this.baseItem = null;
        this.room = room;

        this._frame = 0;
        this._frameCounter = 0;

        this.loaded = false;
        this.drawAsIcon = false;
        this.colorId = Math.floor(Math.random() * (16777215 - 1)) + 1;

        const placeholderContainer = new Container();
        placeholderContainer.zIndex = this.calculateZIndex(0, 0);

        const placeholderSelectableContainer = new Container();
        placeholderSelectableContainer.zIndex = placeholderContainer.zIndex;

        const placeholderSelectableSprite = new Sprite();

        this.sprites = [placeholderSprite];
        this.containers = [placeholderContainer];
        this.containers[0].addChild(placeholderSprite);

        this.selectableSprites = [placeholderSelectableSprite];
        this.selectableContainers = [placeholderSelectableContainer];
        this.selectableContainers[0].addChild(placeholderSelectableSprite);
        this.updateSpritePosition();
    }

    _nextPrivateFrame() {
        this._frame++;
        if (this._nextState !== -1 && this.baseItem != null) {
            if (this._frame >= this.baseItem.furniBase.states[this._state].count) {
                this._actuallySetState(this._nextState);
            }
        }

        this.updateTextures();
    }

    setState(state: number) {
        if (this.baseItem != null && this.baseItem.furniBase.states[state] != null) {
            const { transition } = this.baseItem.furniBase.states[state];
            if (transition != null) {
                this._state = transition;
                this._frame = 0;
                this._nextState = state;
            } else {
                this._actuallySetState(state);
            }
        }
    }


    _actuallySetState(state: number) {
        this._state = state;
        this._nextState = -1;
        this._frame = 0;
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
            const layerCount = this.baseItem.furniBase.offset.visualization[this.baseItem.furniBase.size].layerCount + 1;

            for (let i = 1; i < layerCount; i++) {
                const sprite = new Sprite();
                sprite.visible = false;

                const selectableSprite = new Sprite();
                selectableSprite.visible = false;

                const currentContainer = new Container();
                currentContainer.addChild(sprite);

                const currentSelectableContainer = new Container();
                currentSelectableContainer.addChild(selectableSprite);

                this.sprites.push(sprite);
                this.containers.push(currentContainer);

                this.selectableSprites.push(selectableSprite);
                this.selectableContainers.push(currentSelectableContainer);
            }
            this.updateTextures();
        }
    }

    updateTextures() {
        if (this.baseItem != null) {
            let actualState = 0;
            let actualFrame = 0;
            let layerIndex = 0;
            if (this.drawAsIcon) {
                const sprite = this.sprites[layerIndex];
                const container = this.containers[layerIndex];

                sprite.texture = this.baseItem.iconTexture;
                sprite.x = -(this.baseItem.iconTexture.width / 2);
                sprite.y = -(this.baseItem.iconTexture.height / 2);
                sprite.scale.x = 1;
                sprite.blendMode = BLEND_MODES.NORMAL;
                sprite.alpha = 1.0;
                sprite.tint = 0xFFFFFF;

                container.zIndex = this.calculateZIndex(0, layerIndex);
                layerIndex++;
            } else {
                if (this.baseItem.furniBase.states[this._state] != null) {
                    actualState = this._state;
                    actualFrame = this._frame % this.baseItem.furniBase.states[this._state].count;
                }
                for (let layer of this.baseItem.furniBase.getLayers(this.rot, actualState, actualFrame)) {
                    const texture = this.baseItem.getTexture(layer.resourceName);
                    const selectableTexture = this.baseItem.getSolidTexture(layer.resourceName);
                    if (texture != null) {
                        const sprite = this.sprites[layerIndex];
                        const selectableSprite = this.selectableSprites[layerIndex];
                        const zIndex = layer.z || 0;

                        sprite.texture = texture;
                        sprite.visible = true;

                        if (selectableTexture != null && !layer.ignoreMouse) {
                            selectableSprite.texture = selectableTexture;
                            selectableSprite.visible = true;
                        }

                        sprite.x = -layer.asset.x;
                        sprite.y = -layer.asset.y;

                        selectableSprite.x = -layer.asset.x;
                        selectableSprite.y = -layer.asset.y;

                        if (layer.asset.isFlipped) {
                            sprite.x = layer.asset.x;
                            sprite.scale.x = -1;

                            selectableSprite.x = layer.asset.x;
                            selectableSprite.scale.x = -1;
                        } else {
                            sprite.scale.x = 1;

                            selectableSprite.scale.x = 1;
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

                        //////////////////// GENERATE A COLOR FOR EACH FURNI
                        selectableSprite.tint = this.colorId;
                        ////////////////////

                        this.containers[layerIndex].zIndex = this.calculateZIndex(zIndex, layerIndex);
                        this.selectableContainers[layerIndex].zIndex = this.containers[layerIndex].zIndex;
                        layerIndex++;
                    }
                }
            }
            for (let i = layerIndex; i < this.sprites.length; i++) {
                this.sprites[i].visible = false;
                this.selectableSprites[i].visible = false;
            }
        }
    }

    loadBase(): Promise<ContainerGroup> {
        return BobbaEnvironment.getGame().baseItemManager.getItem(this.getItemType(), this.baseId).then(baseItem => {
            this.baseItem = baseItem;
            this.setAdditionalSprites();
            this.updateSpritePosition();
            return { containers: this.containers, selectableContainers: this.selectableContainers };
        });
    }

    startMovement() {
        for (let container of this.containers) {
            container.alpha = 0.7;
        }
    }

    stopMovement() {
        for (let container of this.containers) {
            container.alpha = 1.0;
        }
    }

    abstract rotate(): void;

    abstract calculateZIndex(zIndex: number, layerIndex: number): number;

    abstract updateSpritePosition(): void;

    abstract getItemType(): ItemType;

    abstract updatePosition(x: number, y: number, z: number, rot: Direction, drawAsIcon: boolean): void;

    handleClick = (id: number) => {
        this.showItemInfo(false);
    }

    showItemInfo(isUpdate: boolean) {
        if (this.baseItem != null) {
            const states = Object.keys(this.baseItem.furniBase.states).length;
            BobbaEnvironment.getGame().uiManager.onSelectFurni(this.id, this.baseId, this.baseItem.furniBase.itemData.name, this.baseItem.furniBase.itemData.description, this.baseItem.infoImage, isUpdate, true, this.getItemType() === ItemType.FloorItem, true, states !== 1);
        }
    }

    handleHover(id: number): void {

    }

    handleDoubleClick(id: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniInteract(this.id));
    }

    pickUp() {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniPickUp(this.id));
    }
}

interface ContainerGroup {
    containers: Container[],
    selectableContainers: Container[]
}
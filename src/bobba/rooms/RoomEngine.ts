import Room from "./Room";
import { Sprite, Container, Point, Texture } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import MainEngine from "../graphics/MainEngine";
import { ROOM_TILE_WIDTH, ROOM_TILE_HEIGHT, ROOM_SELECTED_TILE, ROOM_TILE, ROOM_WALL_L, ROOM_WALL_R, ROOM_WALL_DOOR_EXTENDED_L, ROOM_WALL_DOOR_EXTENDED_L_OFFSET_X, ROOM_WALL_DOOR_EXTENDED_L_OFFSET_Y, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y, ROOM_WALL_R_OFFSET_X, ROOM_WALL_R_OFFSET_Y } from "../graphics/GenericSprites";
import RequestMovement from "../communication/outgoing/rooms/RequestMovement";

const CAMERA_CENTERED_OFFSET_X = 3;
const CAMERA_CENTERED_OFFSET_Y = 114;

const ROOM_SELECTED_TILE_OFFSET_X = 0;
const ROOM_SELECTED_TILE_OFFSET_Y = -3;

export default class RoomEngine {
    room: Room;
    container: Container;
    selectableContainer: Container;
    floorSprites: Sprite[];
    wallSprites: Sprite[];
    selectedTileSprite?: Sprite;
    lastMousePositionX: number;
    lastMousePositionY: number;
    userSprites: ContainerDictionary;
    shadowSprites: ContainerDictionary;
    roomItemSprites: ContainerArrayDictionary;
    selectableSprites: ContainerArrayDictionary;
    selectableItems: SelectableDictionary;
    currentSelectedItem?: Selectable | null;

    constructor(room: Room) {
        this.room = room;
        this.container = new Container();
        this.selectableContainer = new Container();
        this.floorSprites = [];
        this.wallSprites = [];
        this.userSprites = {};
        this.shadowSprites = {};
        this.roomItemSprites = {};
        this.selectableSprites = {};
        this.selectableItems = {};
        this.lastMousePositionX = 0;
        this.lastMousePositionY = 0;

        this.container.sortableChildren = true;
        this.selectableContainer.sortableChildren = true;
        this.onResize();
        this.setWalls();
        this.setFloor();
        this.setSelectedTile();
    }

    onResize() {
        this.centerCamera();
    }

    centerCamera() {
        const model = this.room.model;
        this.container.x = Math.round((MainEngine.getViewportWidth() - (ROOM_TILE_WIDTH * (model.maxX - model.maxY + CAMERA_CENTERED_OFFSET_X))) / 2);
        this.container.y = Math.round((MainEngine.getViewportHeight() - ((model.maxX + model.maxY) * ROOM_TILE_HEIGHT) + CAMERA_CENTERED_OFFSET_Y) / 2);

        this.selectableContainer.x = this.container.x;
        this.selectableContainer.y = this.container.y;
    }

    setSelectedTile() {
        const floorTexture = BobbaEnvironment.getGame().engine.getTexture(ROOM_SELECTED_TILE);
        this.selectedTileSprite = new Sprite(floorTexture);
        this.selectedTileSprite.visible = false;
        this.container.addChild(this.selectedTileSprite);
    }

    setChatContainer(container: Container) {
        container.zIndex = calculateZIndexChat();
        this.container.addChild(container);
    }

    addUserContainer(id: number, container: Container, shadowSprite: Sprite) {
        this.userSprites[id] = container;
        this.shadowSprites[id] = shadowSprite;
        this.container.addChild(container);
        this.container.addChild(shadowSprite);
    }

    addRoomItemContainerSet(id: number, containers: Container[]) {
        this.roomItemSprites[id] = containers;
        for (let container of containers) {
            this.container.addChild(container);
        }
    }

    addSelectableContainer(colorId: number, selectableContainers: Container[], selectableElement: Selectable) {
        this.selectableSprites[colorId] = selectableContainers;
        this.selectableItems[colorId] = selectableElement;

        for (let container of selectableContainers) {
            this.selectableContainer.addChild(container);
        }
    }

    removeSelectableContainer(colorId: number) {
        const containers = this.selectableSprites[colorId];
        if (containers != null) {
            for (let container of containers) {
                this.selectableContainer.removeChild(container);
            }
            delete (this.selectableSprites[colorId]);
        }

        const items = this.selectableItems[colorId];
        if (items != null) {
            delete (this.selectableItems[colorId]);
        }
    }

    removeRoomItemContainerSet(id: number) {
        const containers = this.roomItemSprites[id];
        if (containers != null) {
            for (let container of containers) {
                this.container.removeChild(container);
            }
            delete (this.roomItemSprites[id]);
        }
    }

    removeUserSprite(id: number) {
        const sprite = this.userSprites[id];
        const shadowSprite = this.shadowSprites[id];
        if (sprite != null) {
            this.container.removeChild(sprite);
            delete (this.userSprites[id]);
        }
        if (shadowSprite != null) {
            this.container.removeChild(shadowSprite);
            delete (this.shadowSprites[id]);
        }
    }

    _addWallSprite(texture: Texture, x: number, y: number, offsetX: number, offsetY: number, priority: number) {
        const currentSprite = new Sprite(texture);
        const localPos = this.tileToLocal(x, y, 0);
        currentSprite.x = localPos.x + offsetX;
        currentSprite.y = localPos.y + offsetY;
        currentSprite.zIndex = calculateZIndex(x, y, 0, priority);
        this.wallSprites.push(currentSprite);
        this.container.addChild(currentSprite);
    }

    setWalls() {
        const wall_r = BobbaEnvironment.getGame().engine.getTexture(ROOM_WALL_R);
        const wall_l = BobbaEnvironment.getGame().engine.getTexture(ROOM_WALL_L);
        const wall_door_extended_l = BobbaEnvironment.getGame().engine.getTexture(ROOM_WALL_DOOR_EXTENDED_L);
        const model = this.room.model;
        for (let i = 0; i < model.maxY; i++) {
            if (model.doorY === i) {
                this._addWallSprite(wall_door_extended_l, 1, i, ROOM_WALL_DOOR_EXTENDED_L_OFFSET_X, ROOM_WALL_DOOR_EXTENDED_L_OFFSET_Y, PRIORITY_WALL);
            } else if (model.doorY - 1 !== i) {
                this._addWallSprite(wall_l, 1, i, ROOM_WALL_L_OFFSET_X, ROOM_WALL_L_OFFSET_Y, PRIORITY_WALL);
            }
        }
        for (let i = 1; i < this.room.model.maxX; i++) {
            this._addWallSprite(wall_r, i, 1, ROOM_WALL_R_OFFSET_X, ROOM_WALL_R_OFFSET_Y, PRIORITY_WALL);
        }
    }

    setFloor() {
        const floorTexture = BobbaEnvironment.getGame().engine.getTexture(ROOM_TILE);
        this.floorSprites = [];
        const model = this.room.model;
        for (let i = 0; i < model.maxX; i++) {
            for (let j = 0; j < model.maxY; j++) {
                const tile = model.heightMap[i][j];
                if (tile > 0) {
                    const currentSprite = new Sprite(floorTexture);
                    const localPos = this.tileToLocal(i, j, 0);
                    currentSprite.x = localPos.x;
                    currentSprite.y = localPos.y;

                    currentSprite.zIndex = calculateZIndex(i, j, 0, model.doorX === i && model.doorY === j ? PRIORITY_DOOR_FLOOR : PRIORITY_FLOOR);
                    this.floorSprites.push(currentSprite);
                    this.container.addChild(currentSprite);
                }
            }
        }
    }

    tileToLocal(x: number, y: number, z: number): Point {
        return new Point((x - y) * ROOM_TILE_WIDTH, (x + y) * ROOM_TILE_HEIGHT - (z * ROOM_TILE_HEIGHT * 2));
    }

    globalToTile(x: number, y: number): Point {
        const offsetX = this.container.x;
        const offsetY = this.container.y;

        const xminusy = (x - ROOM_TILE_WIDTH - offsetX) / ROOM_TILE_WIDTH;
        const xplusy = (y - offsetY) / ROOM_TILE_HEIGHT;

        const tileX = Math.floor((xminusy + xplusy) / 2);
        const tileY = Math.floor((xplusy - xminusy) / 2);

        return new Point(tileX, tileY);
    }

    handleMouseMovement = (mouseX: number, mouseY: number, isDrag: boolean) => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        const selectable = this.getSelectableItem(mouseX, mouseY);

        if (selectable != null) {
            selectable.handleHover(0);
        }
        if (isDrag) {
            const diffX = Math.round(this.lastMousePositionX - mouseX);
            const diffY = Math.round(this.lastMousePositionY - mouseY);
            this.container.x -= diffX;
            this.container.y -= diffY;
            this.selectableContainer.x = this.container.x;
            this.selectableContainer.y = this.container.y;
        }
        this.lastMousePositionX = Math.round(mouseX);
        this.lastMousePositionY = Math.round(mouseY);
        this.updateSelectedTile(x, y)
    }

    getSelectableItem(mouseX: number, mouseY: number): Selectable | null {
        const pixels = BobbaEnvironment.getGame().engine.logicPixiApp.renderer.extract.pixels(this.getLogicStage());

        const bounds = this.getLogicStage().getBounds();
        const stageX = Math.floor(mouseX - bounds.x);
        const stageY = Math.floor(mouseY - bounds.y);
        const pos = (stageY * bounds.width + stageX) * 4;
        if (stageX >= 0 && stageY >= 0 && stageX <= bounds.width && stageY <= bounds.height) {
            const colorId = rgb2int(pixels[pos], pixels[pos + 1], pixels[pos + 2]);
            return this.selectableItems[colorId];
        }

        return null;
    }

    handleMouseClick = (mouseX: number, mouseY: number): Selectable | null => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        const selectable = this.getSelectableItem(mouseX, mouseY);

        if (selectable != null) {
            selectable.handleClick(0);
        }

        if (this.room.model.isValidTile(x, y)) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMovement(x, y));
        }

        BobbaEnvironment.getGame().uiManager.onFocusChat();
        return selectable;
    }

    handleTouchMove = (mouseX: number, mouseY: number) => {
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
        this.handleMouseMovement(mouseX, mouseY, true);
    }

    handleTouchStart = (mouseX: number, mouseY: number) => {
        mouseX = Math.floor(mouseX);
        mouseY = Math.floor(mouseY);
        this.handleMouseMovement(mouseX, mouseY, false);
        const newSelectedItem = this.handleMouseClick(mouseX, mouseY);

        if (newSelectedItem === this.currentSelectedItem) {
            this.handleMouseDoubleClick(mouseX, mouseY, newSelectedItem);
        }
        this.currentSelectedItem = newSelectedItem;
    }

    handleMouseDoubleClick = (mouseX: number, mouseY: number, selectable?: Selectable | null) => {
        const { x, y } = this.globalToTile(mouseX, mouseY);
        const model = this.room.model;

        if (selectable === undefined) {
            selectable = this.getSelectableItem(mouseX, mouseY);
        }

        if (selectable != null) {
            selectable.handleDoubleClick(0);
        } else if (!model.isValidTile(x, y)) {
            this.centerCamera();
        }
    }

    updateSelectedTile(tileX: number, tileY: number) {
        const model = this.room.model;
        const localPos = this.tileToLocal(tileX, tileY, 0);
        if (this.selectedTileSprite != null) {
            this.selectedTileSprite.visible = model.isValidTile(tileX, tileY);
            this.selectedTileSprite.x = localPos.x + ROOM_SELECTED_TILE_OFFSET_X;
            this.selectedTileSprite.y = localPos.y + ROOM_SELECTED_TILE_OFFSET_Y;

            this.selectedTileSprite.zIndex = calculateZIndex(tileX, tileY, 0, model.doorX === tileX && model.doorY === tileY ? PRIORITY_DOOR_FLOOR_SELECT : PRIORITY_FLOOR_SELECT);
        }
    }

    tick(delta: number) {

    }

    getStage() {
        return this.container;
    }

    getLogicStage() {
        return this.selectableContainer;
    }

    calculateZIndexUser(x: number, y: number, z: number): number {
        const model = this.room.model;
        return _calculateZIndexUser(x, y, z, model.doorX === x && model.doorY === y ? PRIORITY_DOOR_FLOOR_PLAYER : PRIORITY_PLAYER);
    }

    calculateZIndexUserShadow(x: number, y: number, z: number): number {
        const model = this.room.model;
        return _calculateZIndexUser(x, y, z, model.doorX === x && model.doorY === y ? PRIORITY_DOOR_FLOOR_PLAYER_SHADOW : PRIORITY_PLAYER_SHADOW);
    }
}

interface ContainerDictionary {
    [id: number]: Container;
}

interface ContainerArrayDictionary {
    [id: number]: Container[];
}

export interface Selectable {
    handleClick(id: number): void,
    handleDoubleClick(id: number): void,
    handleHover(id: number): void,
}

interface SelectableDictionary {
    [id: number]: Selectable;
}

export const calculateZIndex = (x: number, y: number, z: number, priority: number): number => {
    return ((x + y) * (COMPARABLE_X_Y) + (z * (COMPARABLE_Z))) + PRIORITY_MULTIPLIER * priority;
};

const _calculateZIndexUser = (x: number, y: number, z: number, priority: number): number => {
    return calculateZIndex(x, y, z + 0.001, priority);
};

export const calculateZIndexFloorItem = (x: number, y: number, z: number, zIndex: number, layerId: number): number => {
    const compareY = (Math.trunc(zIndex / 100)) / 10;
    return calculateZIndex(x, y + compareY, z, PRIORITY_ROOM_ITEM);
};

export const calculateZIndexWallItem = (id: number, x: number, y: number, zIndex: number, layerId: number): number => {
    return (id * COMPARABLE_Z) + layerId + (PRIORITY_MULTIPLIER * PRIORITY_WALL_ITEM);
    //TODO: check this
};

export const rgb2int = (r: number, g: number, b: number) => {
    return (r << 16) + (g << 8) + (b);
};

export const calculateZIndexChat = () => PRIORITY_CHAT * PRIORITY_MULTIPLIER;

const PRIORITY_DOOR_FLOOR = 1;
const PRIORITY_DOOR_FLOOR_SELECT = 2;
const PRIORITY_DOOR_FLOOR_PLAYER_SHADOW = 3;
const PRIORITY_DOOR_FLOOR_PLAYER = 4;
//const PRIORITY_DOOR_WALL = 5;
const PRIORITY_WALL = 6;
const PRIORITY_FLOOR = 7;
const PRIORITY_PLAYER_SHADOW = 8;
const PRIORITY_WALL_ITEM = 9;
const PRIORITY_FLOOR_SELECT = 11;
const PRIORITY_PLAYER = 11;
const PRIORITY_ROOM_ITEM = 11;
//const PRIORITY_SIGN = 12;
const PRIORITY_CHAT = 13;

const PRIORITY_MULTIPLIER = 10000000;
const COMPARABLE_X_Y = 1000000;
const COMPARABLE_Z = 10000;
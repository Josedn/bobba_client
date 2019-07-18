import Room from "../Room";
import RoomItem from "./RoomItem";
import FloorItem from "./FloorItem";
import WallItem from "./WallItem";
import BobbaEnvironment from "../../BobbaEnvironment";
import UserItem from "../../inventory/UserItem";
import { ItemType, Direction } from "../../imagers/furniture/FurniImager";
import RequestFurniMove from "../../communication/outgoing/rooms/RequestFurniMove";
import RequestFurniPlace from "../../communication/outgoing/rooms/RequestFurniPlace";

export default class RoomItemManager {
    room: Room;
    items: RoomItemDictionary;
    currentPlacingItem?: RoomItem;

    constructor(room: Room) {
        this.room = room;
        this.items = {};
    }

    getItem(id: number): RoomItem | null {
        return (id in this.items) ? this.items[id] : null;
    }

    startRoomItemMovement(id: number) {
        const item = this.getItem(id);
        if (item != null) {
            this.room.engine.startRoomItemMove(item);
        }
    }

    startRoomItemPlacement(item: UserItem) {
        if (item.baseItem != null) {
            let promise: Promise<RoomItem> | null = null;
            if (item.itemType === ItemType.FloorItem) {
                const tile = this.room.engine.globalToTile(this.room.engine.lastMousePositionX, this.room.engine.lastMousePositionY);
                promise = this.addFloorItemToRoom(item.id, tile.x, tile.y, 0, item.baseItem.getUIViewDirection(), item.state, item.baseId);
            } else {
                const local = this.room.engine.globalToLocal(this.room.engine.lastMousePositionX, this.room.engine.lastMousePositionY);
                promise = this.addWallItemToRoom(item.id, local.x, local.y, item.baseItem.getUIViewDirection(), item.state, item.baseId);
            }
            promise.then(roomItem => {
                this.currentPlacingItem = roomItem;
                this.startRoomItemMovement(item.id);
            });
        }
    }

    cancelRoomItemMovement(movingItem: RoomItem) {
        if (movingItem === this.currentPlacingItem) {
            this.removeItemFromRoom(movingItem.id, true);
            this.currentPlacingItem = undefined;
            BobbaEnvironment.getGame().uiManager.doOpenInventory();
        }
    }

    finishRoomItemMovement(movingItem: RoomItem) {
        if (movingItem === this.currentPlacingItem) {
            this.removeItemFromRoom(movingItem.id, true);
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniPlace(movingItem.id, movingItem._x, movingItem._y, movingItem.rot));
            BobbaEnvironment.getGame().uiManager.doOpenInventory();
        } else {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestFurniMove(movingItem.id, movingItem._x, movingItem._y, movingItem.rot));
        }
    }

    addFloorItemToRoom(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number): Promise<RoomItem> {
        const item = this.getItem(id);
        if (item != null) {
            this.removeItemFromRoom(id, false);
        }
        const newItem = new FloorItem(id, x, y, z, rot, state, baseId, this.room);
        if (this.currentPlacingItem != null && this.currentPlacingItem.id === id) {
            BobbaEnvironment.getGame().inventory.tryPlaceBaseItem(baseId);
            this.currentPlacingItem = undefined;
        }
        this.room.engine.addRoomItemContainerSet(id, newItem.containers); //placeholder
        this.items[id] = newItem;
        return newItem.loadBase().then(containerGroup => {
            this.room.engine.removeRoomItemContainerSet(id);
            this.room.engine.addRoomItemContainerSet(id, containerGroup.containers);
            this.room.engine.addSelectableContainer(newItem.colorId, containerGroup.selectableContainers, newItem);
            if (item != null) {
                item.showItemInfo(true);
            }
            return newItem;
        });
    }

    addWallItemToRoom(id: number, x: number, y: number, rot: Direction, state: number, baseId: number): Promise<RoomItem> {
        const item = this.getItem(id);
        if (item != null) {
            this.removeItemFromRoom(id, false);
        }
        const newItem = new WallItem(id, x, y, rot, state, baseId, this.room);
        if (this.currentPlacingItem != null && this.currentPlacingItem.id === id) {
            BobbaEnvironment.getGame().inventory.tryPlaceBaseItem(baseId);
            this.currentPlacingItem = undefined;
        }
        this.room.engine.addRoomItemContainerSet(id, newItem.containers); //placeholder
        this.items[id] = newItem;
        return newItem.loadBase().then(containerGroup => {
            this.room.engine.removeRoomItemContainerSet(id);
            this.room.engine.addRoomItemContainerSet(id, containerGroup.containers);
            this.room.engine.addSelectableContainer(newItem.colorId, containerGroup.selectableContainers, newItem);
            if (item != null) {
                item.showItemInfo(true);
            }
            return newItem;
        });


    }

    itemSetState(itemId: number, state: number) {
        const item = this.getItem(itemId);
        if (item != null) {
            item.setState(state);
        }
    }

    removeItemFromRoom(id: number, notifyUi: boolean) {
        this.room.engine.removeRoomItemContainerSet(id);
        const item = this.getItem(id);
        if (item != null) {
            this.room.engine.removeSelectableContainer(item.colorId);
            if (notifyUi) {
                BobbaEnvironment.getGame().uiManager.onCloseSelectFurni(id);
            }
            delete (this.items[id]);
        }
    }

    tick(delta: number) {
        for (let key in this.items) {
            if (this.items[key] != null) {
                this.items[key].tick(delta);
            }
        }
    }
}

interface RoomItemDictionary {
    [id: number]: RoomItem;
}
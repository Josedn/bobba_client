import Room from "../Room";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import RoomItem from "./RoomItem";
import FloorItem from "./FloorItem";
import WallItem from "./WallItem";

export default class RoomItemManager {
    room: Room;
    items: RoomItemDictionary;

    constructor(room: Room) {
        this.room = room;
        this.items = {};
    }

    getItem(id: number): RoomItem | null {
        return (id in this.items) ? this.items[id] : null;
    }

    startFloorItemMovement(id: number) {
        const item = this.getItem(id) as WallItem;
        if (item != null && item instanceof WallItem) {
            this.room.engine.startWallItemMove(item);
        }
    }

    addFloorItemToRoom(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number) {
        const item = this.getItem(id);
        if (item != null) {
            this.removeItemFromRoom(id);
        }
        const newItem = new FloorItem(id, x, y, z, rot, state, baseId, this.room);
        this.room.engine.addRoomItemContainerSet(id, newItem.containers); //placeholder
        newItem.loadBase().then(containerGroup => {
            this.room.engine.removeRoomItemContainerSet(id);
            this.room.engine.addRoomItemContainerSet(id, containerGroup.containers);
            this.room.engine.addSelectableContainer(newItem.colorId, containerGroup.selectableContainers, newItem);
        });
        this.items[id] = newItem;
    }

    addWallItemToRoom(id: number, x: number, y: number, rot: Direction, state: number, baseId: number) {
        const item = this.getItem(id);
        if (item == null) {
            const newItem = new WallItem(id, x, y, rot, state, baseId, this.room);
            this.room.engine.addRoomItemContainerSet(id, newItem.containers); //placeholder
            newItem.loadBase().then(containerGroup => {
                this.room.engine.removeRoomItemContainerSet(id);
                this.room.engine.addRoomItemContainerSet(id, containerGroup.containers);
                this.room.engine.addSelectableContainer(newItem.colorId, containerGroup.selectableContainers, newItem);
            });
            this.items[id] = newItem;

        } else {
            //item.updateParams(x, y...);
        }
    }

    itemSetState(itemId: number, state: number) {
        const item = this.getItem(itemId);
        if (item != null) {
            item.setState(state);
        }
    }

    removeItemFromRoom(id: number) {
        this.room.engine.removeRoomItemContainerSet(id);
        const item = this.getItem(id);
        if (item != null) {
            this.room.engine.removeSelectableContainer(item.colorId);
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
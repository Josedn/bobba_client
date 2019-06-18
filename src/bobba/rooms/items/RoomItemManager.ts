import Room from "../Room";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import RoomItem from "./RoomItem";

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

    addItemToRoom(id: number, x: number, y: number, z: number, rot: Direction, state: number, baseId: number) {
        const item = this.getItem(id);
        if (item == null) {
            const newItem = new RoomItem(id, x, y, z, rot, state, baseId, this.room);
            this.room.engine.addRoomItemContainerSet(id, newItem.containers); //placeholder
            newItem.loadBase().then(containers => {
                this.room.engine.removeRoomItemContainerSet(id);
                this.room.engine.addRoomItemContainerSet(id, containers);
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
        if (this.getItem(id) != null) {
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
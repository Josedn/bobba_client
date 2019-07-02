import UserItem from "./UserItem";
import { ItemType } from "../imagers/furniture/FurniImager";
import BobbaEnvironment from "../BobbaEnvironment";
import BaseItem from "../items/BaseItem";

export default class Inventory {
    items: UserItemDictionary;
    lastPlacedBaseItem?: BaseItem;
    constructor() {
        this.items = {};
    }

    getItem(id: number): UserItem | null {
        return (id in this.items) ? this.items[id] : null;
    }

    addItem(itemId: number, baseId: number, state: number, stackable: boolean, itemType: ItemType) {
        if (this.getItem(itemId) == null) {
            const newItem = new UserItem(itemId, baseId, state, stackable, itemType);
            this.items[itemId] = newItem;
            this.updateInventory();
            newItem.loadBase().then(() => {
                this.updateInventory();
            });
        }
    }

    removeItem(itemId: number) {
        const item = this.getItem(itemId);
        if (item != null) {
            delete (this.items[itemId]);
            this.updateInventory();
        }
    }

    tryPlaceItem(itemId: number) {
        const item = this.getItem(itemId);
        const { currentRoom } = BobbaEnvironment.getGame();
        if (item != null && currentRoom != null && item.baseItem != null) {
            BobbaEnvironment.getGame().uiManager.onCloseInventory();
            currentRoom.roomItemManager.startRoomItemPlacement(item);
            this.lastPlacedBaseItem = item.baseItem;
        }
    }

    findItemByBase(baseId: number): UserItem | null {
        for (let userItemId in this.items) {
            const currentItem = this.items[userItemId];
            if (currentItem.baseId === baseId) {
                return currentItem;
            }
        }
        return null;
    }

    tryPlaceBaseItem(baseId: number) {
        const item = this.findItemByBase(baseId);
        const { currentRoom } = BobbaEnvironment.getGame();
        if (item != null && currentRoom != null && item.baseItem != null) {
            BobbaEnvironment.getGame().uiManager.onCloseInventory();
            currentRoom.roomItemManager.startRoomItemPlacement(item);
            this.lastPlacedBaseItem = item.baseItem;
        }
    }

    updateInventory() {
        BobbaEnvironment.getGame().uiManager.onUpdateInventory(Object.values(this.items));
    }
}



type UserItemDictionary = {
    [id: number]: UserItem
};
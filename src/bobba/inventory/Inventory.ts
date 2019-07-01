import UserItem from "./UserItem";
import { ItemType } from "../imagers/furniture/FurniImager";

export default class Inventory {
    items: UserItemDictionary;
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
            newItem.loadBase();
        }
    }

    removeItem(itemId: number) {
        const item = this.getItem(itemId);
        if (item != null) {

        }
    }

}



type UserItemDictionary = {
    [id: number]: UserItem
};
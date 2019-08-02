import { ItemType } from "../imagers/furniture/FurniImager";
import BobbaEnvironment from "../BobbaEnvironment";
import BaseItem from "../items/BaseItem";

export default class CatalogueItem {
    itemId: number;
    itemName: string;
    cost: number;
    itemType: ItemType;
    baseId: number;
    baseItem: BaseItem | null;
    amount: number;

    constructor(itemId: number, itemName: string, cost: number, itemType: ItemType, baseId: number, amount: number) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.cost = cost;
        this.itemType = itemType;
        this.baseId = baseId;
        this.amount = amount;
        this.baseItem = null;
    }

    loadBase(): Promise<BaseItem> {
        return BobbaEnvironment.getGame().baseItemManager.getItem(this.itemType, this.baseId).then(baseItem => {
            this.baseItem = baseItem;
            return baseItem;
        });
    }
}
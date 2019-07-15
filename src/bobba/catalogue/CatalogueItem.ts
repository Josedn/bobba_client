import { ItemType } from "../imagers/furniture/FurniImager";

export default class CatalogueItem {
    itemId: number;
    itemName: string;
    cost: number;
    itemType: ItemType;
    baseId: number;
    amount: number;

    constructor(itemId: number, itemName: string, cost: number, itemType: ItemType, baseId: number, amount: number) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.cost = cost;
        this.itemType = itemType;
        this.baseId = baseId;
        this.amount = amount;
    }
}
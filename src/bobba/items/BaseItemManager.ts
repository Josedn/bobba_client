import FurniImager, { ItemType } from "../imagers/furniture/FurniImager";
import BaseItem from "./BaseItem";
import BobbaEnvironment from "../BobbaEnvironment";

export default class BaseItemManager {
    furniImager: FurniImager;
    items: BaseItemPromiseDictionary;

    constructor(furniImager: FurniImager) {
        this.furniImager = furniImager;
        this.items = {};
    }

    getItem(itemType: ItemType, itemId: number): Promise<BaseItem> {
        if (this.items[itemId] == null) {
            this.items[itemId] = new Promise((resolve, reject) => {
                BobbaEnvironment.getGame().furniImager.loadItemBase(itemType, itemId, 64).then(furniBase => {
                    const baseItem = new BaseItem(furniBase);
                    resolve(baseItem);
                }).catch(err => reject(err));
            });
        }
        return this.items[itemId];
    }

}

interface BaseItemPromiseDictionary {
    [id: number]: Promise<BaseItem>;
}
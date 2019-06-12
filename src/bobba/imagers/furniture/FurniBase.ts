import { Size } from "./FurniImager";

export default class FurniBase {
    itemId: number;
    itemName: string;
    size: Size;
    promise: Promise<any> | null;
    states: object;
    assets: any;

    constructor(itemId: number, itemName: string, size: Size) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.size = size;
        this.promise = null;
        this.states = {};
        this.assets = {};
    }
}
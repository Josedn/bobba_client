export default class FurniBase {
    itemId: number;
    itemName: string;
    size: number;
    promise: Promise<any> | null;
    states: object;
    assets: object;

    constructor(itemId: number, itemName: string, size: number) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.size = size;
        this.promise = null;
        this.states = {};
        this.assets = {};
    }
}
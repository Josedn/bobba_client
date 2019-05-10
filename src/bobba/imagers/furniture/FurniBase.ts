export default class FurniBase {
    itemId: number;
    itemName: string;
    size: number;
    promise: Promise<any> | null;
    sprites: object;

    constructor(itemId: number, itemName: string, size: number) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.size = size;
        this.sprites = {};
        this.promise = null;
    }
}
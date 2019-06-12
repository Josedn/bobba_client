export default class FurniAsset {
    image: HTMLImageElement;
    x: number;
    y: number;

    constructor(image: HTMLImageElement, x: number, y: number) {
        this.image = image;
        this.x = x;
        this.y = y;
    }
}

export interface FurniAssetDictionary {
    [id: string]: FurniAsset;
}
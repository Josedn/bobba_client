export default class FurniAsset {
    image: HTMLImageElement;
    x: number;
    y: number;
    isFlipped: boolean;

    constructor(image: HTMLImageElement, x: number, y: number, isFlipped: boolean) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.isFlipped = isFlipped;
    }
}

export interface FurniAssetDictionary {
    [id: string]: FurniAsset;
}
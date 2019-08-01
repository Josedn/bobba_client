import FurniBase from "../imagers/furniture/FurniBase";
import { Texture } from 'pixi.js-legacy';
import BobbaEnvironment from "../BobbaEnvironment";
import { TextureDictionary } from "../graphics/MainEngine";
import { generateSilhouette } from "../imagers/misc/Silhouettes";
import { Direction } from "../imagers/furniture/FurniImager";

export default class BaseItem {
    furniBase: FurniBase;
    textures: TextureDictionary;
    solidTextures: TextureDictionary;
    infoImage: HTMLCanvasElement;
    iconImage: HTMLCanvasElement;
    iconTexture: Texture;

    constructor(furniBase: FurniBase) {
        this.furniBase = furniBase;
        this.textures = {};
        this.solidTextures = {};

        for (let assetId in this.furniBase.assets) {
            const asset = this.furniBase.assets[assetId];
            this._loadTexture(asset.image, assetId);
        }

        this.infoImage = this.furniBase.draw(this.getUIViewDirection(), 0, 0);
        this.iconImage = this.furniBase.drawIcon();
        this.iconTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(this.iconImage);
    }

    calculateNextDirection(current: Direction): Direction {
        const available = this.furniBase.getAvailableDirections();
        const pos = available.indexOf(current);
        return available[(pos + 1) % available.length];
    }

    getUIViewDirection(): Direction {
        const directions = this.furniBase.getAvailableDirections();
        if (directions.includes(4)) {
            return 4;
        }
        if (directions.includes(2)) {
            return 2;
        }
        return directions[0];
    }

    getTexture(key: string): Texture | null {
        if (this.textures[key] != null) {
            return this.textures[key];
        }
        return null;
    }

    getSolidTexture(key: string): Texture | null {
        if (this.solidTextures[key] != null) {
            return this.solidTextures[key];
        }
        return null;
    }

    _loadTexture(image: HTMLImageElement, key: string) {
        this.textures[key] = BobbaEnvironment.getGame().engine.getTextureFromImage(image);
        this._loadSolidTexture(image, key);
    }

    _loadSolidTexture(image: HTMLImageElement, key: string) {
        this.solidTextures[key] = BobbaEnvironment.getGame().engine.getTextureFromImage(generateSilhouette(image, 255, 255, 255));
    }

}
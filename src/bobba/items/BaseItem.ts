import FurniBase from "../imagers/furniture/FurniBase";
import { Texture } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import { TextureDictionary } from "../graphics/MainEngine";

export default class BaseItem {
    furniBase: FurniBase;
    textures: TextureDictionary;

    constructor(furniBase: FurniBase) {
        this.furniBase = furniBase;
        this.textures = {};

        for (let assetId in this.furniBase.assets) {
            const asset = this.furniBase.assets[assetId];
            this._loadTexture(asset.image, assetId);
        }
    }

    getTexture(key: string): Texture | null {
        if (this.textures[key] != null) {
            return this.textures[key];
        }
        return null;
    }

    _loadTexture(image: HTMLImageElement, key: string) {
        this.textures[key] = BobbaEnvironment.getGame().engine.getTextureFromImage(image);
    }

}
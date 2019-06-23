import FurniBase from "../imagers/furniture/FurniBase";
import { Texture } from "pixi.js";
import BobbaEnvironment from "../BobbaEnvironment";
import { TextureDictionary } from "../graphics/MainEngine";
import { generateSilhouette } from "../imagers/misc/Silhouettes";

export default class BaseItem {
    furniBase: FurniBase;
    textures: TextureDictionary;
    solidTextures: TextureDictionary;

    constructor(furniBase: FurniBase) {
        this.furniBase = furniBase;
        this.textures = {};
        this.solidTextures = {};

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
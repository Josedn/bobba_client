import { Size, Direction, splitItemNameAndColor } from "./FurniImager";
import FurniAsset, { FurniAssetDictionary } from "./FurniAsset";

export default class FurniBase {
    itemId: number;
    itemName: string;
    size: Size;
    promise: Promise<any> | null;
    states: any;
    assets: FurniAssetDictionary;
    offset: any;

    constructor(itemId: number, itemName: string, size: Size) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.size = size;
        this.promise = null;
        this.states = {};
        this.assets = {};
        this.offset = {};
    }

    getLayers(direction: Direction, state: number, frame: number): LayerData[] {
        const chunks: any[] = [];
        const { itemName, colorId } = splitItemNameAndColor(this.itemName);

        const visualization = this.offset.visualization[this.size];
        for (let i = -1; i < visualization.layerCount; i++) {
            let layerData: any = { id: i, frame: 0, resourceName: '' };

            if (i === -1) {
                layerData.alpha = 77;
            }
            if (visualization.layers != null) {
                for (let layer of visualization.layers) {
                    if (parseInt(layer.id) === i) {
                        if (layer.ink != null) {
                            layerData.ink = layer.ink;
                        }
                        if (layer.alpha != null) {
                            layerData.alpha = parseInt(layer.alpha);
                        }
                        if (layer.ignoreMouse != null) {
                            layerData.ignoreMouse = layer.ignoreMouse;
                        }
                    }
                }
            }
            if (visualization.directions != null && visualization.directions[direction] != null) {
                for (let overrideLayer of visualization.directions[direction]) {
                    if (parseInt(overrideLayer.layerId) === i && overrideLayer.z != null) {
                        layerData.z = parseInt(overrideLayer.z);
                    }
                }
            }

            if (visualization.colors != null && visualization.colors[colorId] != null) {
                for (let colorLayer of visualization.colors[colorId]) {
                    if (parseInt(colorLayer.layerId) === i) {
                        layerData.color = parseInt(colorLayer.color, 16);
                    }
                }
            }

            if (visualization.animations != null && visualization.animations[state] != null) {
                for (let animationLayer of visualization.animations[state].layers) {
                    if (parseInt(animationLayer.layerId) === i && animationLayer.frameSequence != null) {
                        layerData.frame = parseInt(animationLayer.frameSequence[frame % animationLayer.frameSequence.length]);
                    }
                }
            }

            layerData.resourceName = buildResourceName(itemName, this.size, i, direction, layerData.frame);
            if (this.assets[layerData.resourceName] != null) {
                layerData.asset = this.assets[layerData.resourceName];
                chunks.push(layerData);
            }
        }

        return chunks;
    }
}

export interface LayerData {
    id: number,
    resourceName: string,
    asset: FurniAsset,
    frame: number,
    alpha?: number,
    color?: number,
    ink?: string,
    ignoreMouse?: string,
    z?: number,
};

const buildResourceName = (itemName: string, size: Size, layerId: number, direction: Direction, frame: number): string => {
    let resourceName = itemName + "_" + size + "_" + getLayerName(layerId) + "_" + direction + "_" + frame;
    return resourceName;
};

const getLayerName = (layerId: number): string => {
    if (layerId === -1) {
        return "sd";
    }
    return String.fromCharCode(97 + layerId);
};
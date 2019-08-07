import { Size, Direction, splitItemNameAndColor, State } from "./FurniImager";
import FurniAsset, { FurniAssetDictionary } from "./FurniAsset";
import { FurniDescription } from "./Furnidata";
import { FurniOffset } from "./FurniOffset";

export default class FurniBase {
    itemId: number;
    itemData: FurniDescription;
    size: Size;
    states: { [id: number]: State };
    assets: FurniAssetDictionary;
    offset: FurniOffset;

    constructor(itemId: number, itemData: FurniDescription, offset: FurniOffset, size: Size) {
        this.itemId = itemId;
        this.itemData = itemData;
        this.size = size;
        this.states = {};
        this.assets = {};
        this.offset = offset;
    }

    getAvailableDirections(): Direction[] {
        const directions: Direction[] = [];
        const visualization = this.offset.visualization[this.size];
        const rawDirections = visualization.directions;
        for (let rawDirection in rawDirections) {
            directions.push(parseInt(rawDirection) as Direction);
        }
        return directions;
    }

    drawIcon(): HTMLCanvasElement {
        return this.draw(0, 0, 0, true);
    }

    draw(direction: Direction, state: number, frame: number, isIcon?: boolean): HTMLCanvasElement {
        const layers = this.getLayers(direction, state, frame, isIcon);
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = 1;
        tempCanvas.height = 1;

        if (tempCtx != null) {
            let lefterX = 1000;
            let lefterFlippedX = 1000;
            let righterX = 0;
            let upperY = 1000;
            let lowerY = 0;
            for (let layer of layers) {
                let posX = -layer.asset.x;
                let posY = -layer.asset.y;
                let img: HTMLImageElement = layer.asset.image;

                if (layer.asset.isFlipped) {
                    const flippedPosX = layer.asset.x - img.width;
                    if (lefterFlippedX > flippedPosX) {
                        lefterFlippedX = flippedPosX;
                    }
                }


                if (lefterX > posX) {
                    lefterX = posX;
                }
                if (upperY > posY) {
                    upperY = posY;
                }
                if (righterX < posX + img.width) {
                    righterX = posX + img.width;
                }
                if (lowerY < posY + img.height) {
                    lowerY = posY + img.height;
                }

                tempCanvas.width = righterX - lefterX;
                tempCanvas.height = lowerY - upperY;
            }

            for (let layer of layers) {
                let posX = -lefterX - layer.asset.x;
                let posY = -upperY - layer.asset.y;
                let img: HTMLImageElement | HTMLCanvasElement = layer.asset.image;

                if (layer.asset.isFlipped) {
                    const flipped = flipImage(img);
                    if (flipped != null) {
                        posX = layer.asset.x - img.width - lefterFlippedX;
                        img = flipped;
                    }
                }

                if (layer.ink != null && layer.ink === 'ADD') {
                    tempCtx.globalCompositeOperation = "lighter";
                } else {
                    tempCtx.globalCompositeOperation = "source-over";
                }

                if (layer.alpha != null) {
                    const tinted = this._tintSprite(img, 0xffffff, layer.alpha);
                    if (tinted != null) {
                        img = tinted;
                    }
                }

                if (layer.color != null) {
                    const tinted = this._tintSprite(img, layer.color, 255);
                    if (tinted != null) {
                        img = tinted;
                    }
                }

                tempCtx.drawImage(img, posX, posY);
            }
        }

        return tempCanvas;
    }

    _int2rgb(color: number): RGB {
        return {
            r: ((color >> 16) & 0xff),
            g: ((color >> 8) & 0xff),
            b: ((color) & 0xff)
        }
    }

    _tintSprite(img: HTMLCanvasElement | HTMLImageElement, color: number, alpha: number): HTMLCanvasElement | null {
        let element = document.createElement('canvas');
        let c = element.getContext("2d");
        if (c == null)
            return null;

        let rgb = this._int2rgb(color);

        let width = img.width;
        let height = img.height;

        element.width = width;
        element.height = height;

        c.drawImage(img, 0, 0);
        let imageData = c.getImageData(0, 0, width, height);
        for (let y = 0; y < height; y++) {
            let inpos = y * width * 4;
            for (let x = 0; x < width; x++) {
                inpos++; //r
                inpos++; //g
                inpos++; //b
                let pa = imageData.data[inpos++];
                if (pa !== 0) {
                    imageData.data[inpos - 1] = alpha; //A
                    imageData.data[inpos - 2] = Math.round(rgb.b * imageData.data[inpos - 2] / 255); //B
                    imageData.data[inpos - 3] = Math.round(rgb.g * imageData.data[inpos - 3] / 255); //G
                    imageData.data[inpos - 4] = Math.round(rgb.r * imageData.data[inpos - 4] / 255); //R
                }
            }
        }
        c.putImageData(imageData, 0, 0);
        return element;
    }

    getLayers(direction: Direction, state: number, frame: number, isIcon?: boolean): LayerData[] {
        const chunks: LayerData[] = [];
        const { itemName, colorId } = splitItemNameAndColor(this.itemData.classname);

        const visualization = this.offset.visualization[isIcon ? 1 : this.size];
        for (let i = isIcon ? 0 : -1; i < visualization.layerCount; i++) {
            let layerData: any = { id: i, frame: 0, resourceName: '' };

            if (i === -1) {
                layerData.alpha = 77;
            }
            if (visualization.layers != null) {
                for (let layer of visualization.layers) {
                    if (layer.layerId === i) {
                        if (layer.z != null) {
                            layerData.z = layer.z;
                        }
                        if (layer.ink != null) {
                            layerData.ink = layer.ink;
                        }
                        if (layer.alpha != null) {
                            layerData.alpha = layer.alpha;
                        }
                        if (layer.ignoreMouse != null) {
                            layerData.ignoreMouse = layer.ignoreMouse === 1;
                        }
                    }
                }
            }
            if (visualization.directions != null && visualization.directions[direction] != null) {
                for (let overrideLayer of visualization.directions[direction]) {
                    if (overrideLayer.layerId === i && overrideLayer.z != null) {
                        layerData.z = overrideLayer.z;
                    }
                }
            }

            if (visualization.colors != null && visualization.colors[colorId] != null) {
                for (let colorLayer of visualization.colors[colorId]) {
                    if (colorLayer.layerId === i) {
                        layerData.color = parseInt(colorLayer.color, 16);
                    }
                }
            }

            if (visualization.animations != null && visualization.animations[state] != null) {
                for (let animationLayer of visualization.animations[state].layers) {
                    if (animationLayer.layerId === i && animationLayer.frameSequence != null) {
                        if (animationLayer.frameSequence.length === 1) {
                            layerData.frame = animationLayer.frameSequence[0][frame % animationLayer.frameSequence[0].length];
                        } else {
                            let frameCount = 0;
                            for (let i = 0; i < animationLayer.frameSequence.length; i++) {
                                const currentSequence = animationLayer.frameSequence[i];
                                if (frame < currentSequence.length + frameCount && frame > frameCount) {
                                    layerData.frame = currentSequence[(frame - frameCount - 1) % currentSequence.length];
                                    break;
                                } else {
                                    frameCount += currentSequence.length;
                                }
                            }
                        }
                    }
                }
            }
            layerData.resourceName = buildResourceName(itemName, isIcon ? 1 : this.size, i, direction, layerData.frame);

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
    ignoreMouse?: boolean,
    z?: number,
};

const buildResourceName = (itemName: string, size: Size, layerId: number, direction: Direction, frame: number): string => {
    if (size === 1) {
        return itemName + "_icon_" + getLayerName(layerId);
    }
    return itemName + "_" + size + "_" + getLayerName(layerId) + "_" + direction + "_" + frame;
};

const getLayerName = (layerId: number): string => {
    if (layerId === -1) {
        return "sd";
    }
    return String.fromCharCode(97 + layerId);
};

interface RGB {
    r: number, g: number, b: number
}

export const flipImage = (img: HTMLCanvasElement | HTMLImageElement): HTMLCanvasElement | null => {
    let element = document.createElement('canvas');
    let c = element.getContext("2d");
    if (c == null)
        return null;

    let width = img.width;
    let height = img.height;
    element.width = width;
    element.height = height;

    c.save();
    c.scale(-1, 1);
    c.drawImage(img, 0, 0, width * -1, height);
    c.restore();

    return element;
}
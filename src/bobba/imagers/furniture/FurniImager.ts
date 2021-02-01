import FurniBase from "./FurniBase";
import FurniAsset from "./FurniAsset";
import { FurniOffset } from "./FurniOffset";
import { Furnidata, FurniDescription } from "./Furnidata";
import { extractImage } from "./Atlas";

export default class FurniImager {
    ready: boolean;
    bases: { roomitem: { [id: string]: Promise<FurniBase> }, wallitem: { [id: string]: Promise<FurniBase> } };
    offsets: { [id: string]: Promise<FurniOffset> };
    furnidata: Furnidata;
    resourcesUrl: string;

    constructor(resourcesUrl: string) {
        this.resourcesUrl = resourcesUrl;
        this.ready = false;
        this.bases = { roomitem: {}, wallitem: {} };
        this.furnidata = { roomitemtypes: {}, wallitemtypes: {} };
        this.offsets = {};
    }

    findItemByName(itemName: string) {
        for (let itemId in this.furnidata.roomitemtypes) {
            const item = this.furnidata.roomitemtypes[itemId];
            if (item.classname === itemName) {
                return { item, type: 'roomitemtypes' };
            }
        }
        for (let itemId in this.furnidata.wallitemtypes) {
            const item = this.furnidata.wallitemtypes[itemId];
            if (item.classname === itemName) {
                return { item, type: 'wallitemtypes' };
            }
        }
        return null;
    }

    findItemById(type: ItemType, itemId: number): FurniDescription | null {
        const furnidataType = type === 'roomitem' ? 'roomitemtypes' : 'wallitemtypes';
        if (this.furnidata[furnidataType][itemId] != null) {
            return this.furnidata[furnidataType][itemId];
        }
        return null;
    }

    loadItemBase(type: ItemType, itemId: number, size: Size): Promise<FurniBase> {
        const rawItem = this.findItemById(type, itemId);
        if (rawItem == null) {
            return new Promise((resolve, reject) => {
                reject('invalid itemId ' + itemId);
            });
        }
        const rawItemName = rawItem.classname;
        const { itemName } = splitItemNameAndColor(rawItemName);

        if (this.bases[type][itemId] == null) {
            this.bases[type][itemId] = new Promise((resolve, reject) => {
                if (this.offsets[itemName] == null) {
                    this.offsets[itemName] = this._fetchOffsetAsync(itemName);
                }
                const offsetPromise = this.offsets[itemName];

                offsetPromise.then(async (offset) => {
                    const visualization = offset.visualization[64];
                    let states: { [id: number]: State } = { "0": { count: 1 } };

                    const furniBase = new FurniBase(itemId, rawItem, offset, size);

                    if (visualization.animations != null) {
                        for (let stateIdStr in visualization.animations) {
                            const stateId = parseInt(stateIdStr);
                            let count = 1;
                            for (let animationLayer of visualization.animations[stateId].layers) {
                                if (animationLayer.frameSequence != null) {
                                    let frameSequenceLength = 0;
                                    animationLayer.frameSequence.forEach(sequence => {
                                        frameSequenceLength += sequence.length;
                                    });
                                    if (count < frameSequenceLength) {
                                        count = frameSequenceLength;
                                    }
                                }
                            }
                            states[stateId] = { count };
                            if (visualization.animations[stateId] != null) {
                                const { transitionTo } = visualization.animations[stateId];
                                if (transitionTo != null) {
                                    const allegedTransition = transitionTo;
                                    states[stateId].transitionTo = allegedTransition;
                                    states[allegedTransition].transition = stateId;
                                }
                            }
                        }
                    }

                    const atlasImg = await this._downloadImageAsync(itemName, "atlas");

                    for (let assetId in offset.assets) {
                        const asset = offset.assets[assetId];
                        const fixedName = asset.name.split(itemName + '_')[1] as String;
                        if (fixedName.startsWith(size.toString()) || fixedName.startsWith("icon_")) {
                            let sourceAsset = asset;
                            if (asset.source != null) {
                                sourceAsset = offset.assets[asset.source];
                            }
                            if (sourceAsset != null && sourceAsset.exists) {
                                const extractedImage = extractImage(offset.atlas, atlasImg, sourceAsset.name + ".png");
                                if (extractedImage != null) {
                                    furniBase.assets[asset.name] = new FurniAsset(extractedImage, asset.x, asset.y, asset.flipH != null && asset.flipH === 1);
                                }
                            }
                        }
                    }

                    /*for (let assetId in offset.assets) {
                        const asset = offset.assets[assetId];
                        const fixedName = asset.name.split(itemName + '_')[1] as String;
                        if (fixedName.startsWith(size.toString()) || fixedName.startsWith("icon_")) {
                            let sourceAsset = asset;
                            if (asset.source != null) {
                                sourceAsset = offset.assets[asset.source];
                            }
                            if (sourceAsset != null && sourceAsset.exists) {
                                console.log(itemName + " --> " + sourceAsset.name);
                                assetsPromises.push(this._downloadImageAsync(itemName, sourceAsset.name).then(img => {
                                    furniBase.assets[asset.name] = new FurniAsset(img, asset.x, asset.y, asset.flipH != null && asset.flipH === 1);
                                }).catch(err => {
                                    console.log("Cannot download " + asset.name);
                                    //reject(err);
                                }));
                            }
                        }
                    }*/
                    furniBase.states = states;
                    resolve(furniBase);

                }).catch(err => {
                    reject("Error downloading offset for " + itemName + " reason: " + err);
                });
            });
        }
        return this.bases[type][itemId];
    }

    initialize(): Promise<void> {
        const p = this._loadFiles();
        return Promise.all(p).then(() => {
            this.ready = true;
        });
    }

    _loadFiles(): Promise<void>[] {
        return [
            this._fetchJsonAsync(this.resourcesUrl + "furnidata.json")
                .then(data => {
                    this.furnidata = data as Furnidata;
                }),
        ];
    }

    _downloadImageAsync(itemName: string, resourceName: string): Promise<HTMLImageElement> {
        let img = new Image();
        let d: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
            img.onload = () => {
                //console.log("downloaded " + this.itemName + " -> " + this.resourceName);
                resolve(img);
            };
            img.onerror = () => {
                //console.log("NOT DOWNLOADED " + this.itemName + " -> " + this.resourceName);
                reject('Could not load image: ' + img.src);
            };
        });
        img.crossOrigin = "anonymous";
        img.src = this.resourcesUrl + itemName + "/" + resourceName + ".png";
        return d;
    }

    _fetchJsonAsync(url: string): Promise<object> {
        return new Promise((resolve, reject) => {

            const options: RequestInit = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };

            fetch(url, options)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    async _fetchXmlAsync(url: string): Promise<string> {
        return new Promise((resolve, reject) => {

            const options: RequestInit = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };

            fetch(url, options)
                .then(response => response.text())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    _fetchOffsetAsync(uniqueName: string): Promise<FurniOffset> {
        return new Promise((resolve, reject) => {
            this._fetchJsonAsync(this.resourcesUrl + uniqueName + '/furni.json').then(data => {
                resolve(data as FurniOffset);
            }).catch(err => reject(err));
        });
    }
}

export type Size = 1 | 64;
export enum ItemType { FloorItem = 'roomitem', WallItem = 'wallitem' }
export interface NameColorPair { itemName: string, colorId: number };
export type Direction = 0 | 2 | 4 | 6;
export type State = { count: number, transitionTo?: number, transition?: number, };

export const splitItemNameAndColor = (itemName: string): NameColorPair => {
    let colorId = 0;
    if (itemName.includes("*")) {
        const longFurniName = itemName.split("*");
        itemName = longFurniName[0];
        colorId = parseInt(longFurniName[1]);
    }
    return { itemName, colorId }
};
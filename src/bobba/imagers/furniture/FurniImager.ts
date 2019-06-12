import FurniBase from "./FurniBase";

export const LOCAL_RESOURCES_URL = "//images.bobba.io/hof_furni/";

export default class FurniImager {
    ready: boolean;
    bases: any;
    offsets: any;
    furnidata: any;

    constructor() {
        this.ready = false;
        this.bases = { roomitem: {}, wallitem: {} };
        this.offsets = {};
    }

    findItemByName(itemName: string) {
        for (let itemTypes in this.furnidata) {
            for (let itemId in this.furnidata[itemTypes]) {
                const item = this.furnidata[itemTypes][itemId];
                if (item.classname === itemName) {
                    return { item, type: itemTypes };
                }
            }
        }
        return null;
    }

    findItemNameById(type: ItemType, itemId: number): string | null {
        if (this.furnidata[type + 'types'][itemId] != null) {
            return this.furnidata[type + 'types'][itemId].classname;
        }
        return null;
    }

    splitItemNameAndColor(itemName: string): NameColorPair {
        let colorId = 0;
        if (itemName.includes("*")) {
            const longFurniName = itemName.split("*");
            itemName = longFurniName[0];
            colorId = parseInt(longFurniName[1]);
        }
        return { itemName, colorId }
    }

    _getOffset(rawItemName: string): any {
        const { itemName } = this.splitItemNameAndColor(rawItemName);
        if (this.offsets[itemName] != null) {
            return this.offsets[itemName].data;
        }
        return null;
    }

    _drawItem(furniBase: FurniBase, direction: Direction, state: number, frame: number) {
        const offset = this._getOffset(furniBase.itemName);
        const { colorId } = this.splitItemNameAndColor(furniBase.itemName);
        if (offset == null) {
            return;
        }

        const visualization = offset.visualization[furniBase.size];

        for (let i = -1; i < visualization.layerCount; i++) {
            let layerData: any = { id: i };

            if (i === -1) {
                layerData.alpha = 77;
            }
            if (visualization.layers != null) {
                for (let layer of visualization.layers) {
                    // eslint-disable-next-line
                    if (layer.id == i) {
                        layerData = layer;
                    }
                }
            }
            if (visualization.directions != null && visualization.directions[direction]) {
                for (let overrideLayer of visualization.directions[direction]) {
                    // eslint-disable-next-line
                    if (overrideLayer.layerId == i && overrideLayer.z != null) {
                        layerData.z = overrideLayer.z;
                    }
                }
            }

            if (visualization.colors != null && visualization.colors[colorId] != null) {
                for (let colorLayer of visualization.colors[colorId]) {
                    // eslint-disable-next-line
                    if (colorLayer.layerId == i) {
                        layerData.color = colorLayer.color;
                    }
                }
            }

            if (visualization.animations != null && visualization.animations[state] != null) {
                for (let animationLayer of visualization.animations[state].layers) {
                    // eslint-disable-next-line
                    if (animationLayer.layerId == i && animationLayer.frameSequence != null) {
                        layerData.frame = animationLayer.frameSequence[frame % animationLayer.frameSequence.length];
                    }
                }
            }


            //console.log(layerData);
        }
    }

    generateItem(type: ItemType, itemId: number) {
        this._loadItemBase(type, itemId, 64).then(furniBase => {
            this._drawItem(furniBase, 0, 0, 0);

        }).catch(err => {
            console.log(err);
        });
    }

    _loadItemBase(type: ItemType, itemId: number, size: Size): Promise<FurniBase> {
        const rawItemName = this.findItemNameById(type, itemId);
        if (rawItemName == null) {
            return new Promise((resolve, reject) => {
                reject('invalid itemId ' + itemId);
            });
        }

        const { itemName } = this.splitItemNameAndColor(rawItemName);

        if (this.bases[type][itemId] != null && this.bases[type][itemId].promise != null) {
            return this.bases[type][itemId].promise;
        }

        this.bases[type][itemId] = new FurniBase(itemId, rawItemName, size);

        if (this.offsets[itemName] == null) {
            this.offsets[itemName] = { promise: this.fetchOffsetAsync(itemName), data: {} };
        }
        const offsetPromise = this.offsets[itemName].promise as Promise<object>;

        const finalPromise: Promise<FurniBase> = new Promise((resolve, reject) => {
            offsetPromise.then(() => {
                const visualization = this.offsets[itemName].data.visualization[64];
                let states = { "0": { count: 1 } } as any;

                if (visualization.animations != null) {
                    for (let stateId in visualization.animations) {
                        let count = 1;
                        for (let animationLayer of visualization.animations[stateId].layers) {
                            if (animationLayer.frameSequence != null) {
                                if (count < animationLayer.frameSequence.length) {
                                    count = animationLayer.frameSequence.length;
                                }
                            }
                        }
                        states[stateId] = { count };
                        if (visualization.animations[stateId].transitionTo != null) {
                            states[stateId].transitionTo = visualization.animations[stateId].transitionTo;
                            states[states[stateId].transitionTo].transition = stateId;
                        }
                    }
                }

                const assetsPromises = [];

                for (let assetId in this.offsets[itemName].data.assets) {
                    const asset = this.offsets[itemName].data.assets[assetId];
                    const fixedName = asset.name.split(itemName + '_')[1] as String;
                    if (fixedName.startsWith(size.toString())) {
                        if (asset.source == null) {
                            assetsPromises.push(this._downloadAssetAsync(itemName, asset.name).then(img => {
                                this.bases[type][itemId].assets[asset.name] = img;
                            }).catch(err => {
                                reject(err);
                            }));
                        }
                    }
                }
                this.bases[type][itemId].states = states;
                
                Promise.all(assetsPromises).then(() => {

                    
                    resolve(this.bases[type][itemId]);
                }).catch(err => {
                    reject(err);
                });


            }).catch(err => {
                reject("Error downloading offset for " + itemName + " reason: " + err);
            });
        });
        this.bases[type][itemId].promise = finalPromise;
        return finalPromise;
    }

    _downloadAssetAsync(itemName: string, resourceName: string) {
        let img = new Image();
        let d = new Promise((resolve, reject) => {
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
        img.src = LOCAL_RESOURCES_URL + itemName + "/" + resourceName + ".png";
        return d;
    }

    initialize(): Promise<void> {
        const p = this.loadFiles();
        return Promise.all(p).then(() => {
            this.ready = true;
        });
    }

    loadFiles(): Promise<void>[] {
        return [
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "furnidata.json")
                .then(data => {
                    this.furnidata = data;
                }),
        ];
    }

    fetchJsonAsync(URL: string): Promise<object> {
        return new Promise((resolve, reject) => {

            const options: RequestInit = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };

            fetch(URL, options)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    fetchOffsetAsync(uniqueName: string): Promise<object> {
        return new Promise((resolve, reject) => {
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + uniqueName + '/furni.json').then(data => {
                this.offsets[uniqueName].data = data;
                resolve(data);
            }).catch(err => reject(err));
        });
    }
}

export type Size = 32 | 64;
export type ItemType = 'roomitem' | 'wallitem';
interface NameColorPair { itemName: string, colorId: number };
export type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
import AvatarInfo, { Direction, FigurePart } from "./AvatarInfo";
import AvatarChunk from "./AvatarChunk";
export default class AvatarImager {
    ready: boolean;
    offsets: any;
    chunks: any;
    figuremap: any;
    figuredata: any;
    partsets: any;
    draworder: any;
    animation: any;
    resourcesUrl: string;

    constructor(resourcesUrl: string) {
        this.ready = false;
        this.offsets = {};
        this.chunks = {};
        this.figuremap = {};
        this.figuredata = {};
        this.partsets = {};
        this.draworder = {};
        this.animation = {};
        this.resourcesUrl = resourcesUrl;
    }

    initialize(): Promise<void> {
        const p = this.loadFiles();
        return Promise.all(p).then(() => {
            this.ready = true;
        });
    }

    loadFiles(): Promise<void>[] {
        return [
            this.fetchJsonAsync(this.resourcesUrl + "map.json")
                .then(data => {
                    this.figuremap = data;
                }),
            this.fetchJsonAsync(this.resourcesUrl + "figuredata.json")
                .then(data => {
                    this.figuredata = data;
                }),
            this.fetchJsonAsync(this.resourcesUrl + "partsets.json")
                .then(data => {
                    this.partsets = data;
                }),
            this.fetchJsonAsync(this.resourcesUrl + "draworder.json")
                .then(data => {
                    this.draworder = data;
                }),
            this.fetchJsonAsync(this.resourcesUrl + "animation.json")
                .then(data => {
                    this.animation = data;
                })
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

    downloadAtlasAsync(uniqueName: string): Promise<HTMLImageElement> {
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
        img.src = this.resourcesUrl + uniqueName + "/atlas.png";
        return d;
    }

    fetchOffsetAsync(uniqueName: string): Promise<any> {
        const offsetPromise = this.fetchJsonAsync(this.resourcesUrl + uniqueName + "/offset.json")
            .then(data => {
                this.offsets[uniqueName].data = data;
            });
        const atlasPromise = this.downloadAtlasAsync(uniqueName)
            .then(data => {
                this.offsets[uniqueName].atlas = data;
            });
        return Promise.all([offsetPromise, atlasPromise]);
    }

    getTypeColorId(figure: string, part: string): number {
        const avatarInfo = new AvatarInfo(figure, 0, 0, ["std"], "std", 0, false, false, "d");
        let color = 0x000000;

        for (let figurePart of avatarInfo.figure) {
            if (figurePart.type === part) {
                const parts = this.getPartColor(figurePart);
                for (let type in parts) {
                    const part = parts[type];
                    for (let particle of part) {
                        if (particle.color != null) {
                            color = parseInt(particle.color, 16);
                            return color;
                        }
                    }
                }
            }
        }
        return color;
    }

    getChatColor(figure: string): number {
        return this.getTypeColorId(figure, 'ch');
    }

    generateGeneric(avatarInfo: AvatarInfo, isGhost: boolean): Promise<HTMLCanvasElement> {
        const activeParts: any = {};
        activeParts.rect = this.getActivePartSet(avatarInfo.isHeadOnly ? "head" : "figure");
        activeParts.head = this.getActivePartSet("head");
        activeParts.eye = this.getActivePartSet("eye");
        activeParts.gesture = this.getActivePartSet("gesture");
        activeParts.speak = this.getActivePartSet("speak");
        activeParts.walk = this.getActivePartSet("walk");
        activeParts.sit = this.getActivePartSet("sit");
        activeParts.itemRight = this.getActivePartSet("itemRight");
        activeParts.handRight = this.getActivePartSet("handRight");
        activeParts.handLeft = this.getActivePartSet("handLeft");
        activeParts.swim = this.getActivePartSet("swim");

        let drawParts = this.getDrawOrder(avatarInfo.drawOrder, avatarInfo.direction);
        if (drawParts == null) {
            drawParts = this.getDrawOrder("std", avatarInfo.direction);
        }

        const setParts: any = {};
        for (let partSet of avatarInfo.figure) {
            const parts = this.getPartColor(partSet);
            for (let type in parts) {
                if (setParts[type] == null) {
                    setParts[type] = [];
                }
                setParts[type] = parts[type].concat(setParts[type]);
            }
        }

        if (avatarInfo.handItem > 0) {
            setParts["ri"] = [{ "index": 0, "id": avatarInfo.handItem }];
        }

        const chunks: AvatarChunk[] = [];
        const offsetsPromises: Promise<void>[] = [];

        for (let type of drawParts) {
            const drawableParts = setParts[type];
            if (drawableParts != null) {
                for (let drawablePart of drawableParts) {
                    const uniqueName = this.getPartUniqueName(type, drawablePart["id"]);
                    if (uniqueName != null) {
                        //console.log(type + " -> " + drawablePart["id"] + " -> " + uniqueName);

                        if (setParts["hidden"].includes(type)) {
                            continue;
                        }

                        if (activeParts.head.includes(type) && avatarInfo.isBodyOnly) {
                            continue;
                        }

                        if (!activeParts.rect.includes(type)) {
                            continue;
                        }

                        if (isGhost && (activeParts.gesture.includes(type) || activeParts.eye.includes(type))) {
                            continue;
                        }

                        let drawDirection = avatarInfo.direction;
                        let drawAction = null;

                        if (activeParts.rect.includes(type)) {
                            drawAction = avatarInfo.drawAction['body'];
                        }
                        if (activeParts.head.includes(type)) {
                            drawDirection = avatarInfo.headDirection;
                        }
                        if (activeParts.speak.includes(type) && avatarInfo.drawAction['speak']) {
                            drawAction = avatarInfo.drawAction['speak'];
                        }
                        if (activeParts.gesture.includes(type) && avatarInfo.drawAction['gesture']) {
                            drawAction = avatarInfo.drawAction['gesture'];
                        }
                        if (activeParts.eye.includes(type)) {
                            drawablePart.colorable = false;
                            if (avatarInfo.drawAction['eye']) {
                                drawAction = avatarInfo.drawAction['eye'];
                            }
                        }
                        if (activeParts.walk.includes(type) && avatarInfo.drawAction['wlk']) {
                            drawAction = avatarInfo.drawAction['wlk'];
                        }
                        if (activeParts.sit.includes(type) && avatarInfo.drawAction['sit']) {
                            drawAction = avatarInfo.drawAction['sit'];
                        }
                        if (activeParts.handRight.includes(type) && avatarInfo.drawAction['handRight']) {
                            drawAction = avatarInfo.drawAction['handRight'];
                        }
                        if (activeParts.itemRight.includes(type) && avatarInfo.drawAction['itemRight']) {
                            drawAction = avatarInfo.drawAction['itemRight'];
                        }
                        if (activeParts.handLeft.includes(type) && avatarInfo.drawAction['handLeft']) {
                            drawAction = avatarInfo.drawAction['handLeft'];
                        }
                        if (activeParts.swim.includes(type) && avatarInfo.drawAction['swm']) {
                            drawAction = avatarInfo.drawAction['swm'];
                        }

                        if (drawAction == null) {
                            continue;
                        }

                        if (this.offsets[uniqueName] == null) {
                            this.offsets[uniqueName] = { 'promise': this.fetchOffsetAsync(uniqueName), 'data': {}, 'atlas': {} };
                        }
                        offsetsPromises.push(this.offsets[uniqueName].promise);

                        const color = drawablePart.colorable ? drawablePart.color : null;
                        const drawPartChunk = this.getPartResource(uniqueName, drawAction, type, avatarInfo.isSmall, drawablePart["id"], drawDirection, avatarInfo.frame, color);
                        chunks.push(drawPartChunk);
                    }
                }
            }
        }

        return new Promise((resolve, reject) => {

            Promise.all(offsetsPromises).then(() => {
                let tempCanvas: any = document.createElement('canvas');
                let tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = avatarInfo.rectWidth;
                tempCanvas.height = avatarInfo.rectHeight;

                const chunksPromises = [];

                for (let chunk of chunks) {
                    if (this.offsets[chunk.lib].data != null && this.offsets[chunk.lib].data[chunk.getResourceName()] != null && !this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                        //console.log("Found sprite: " + chunk.getResourceName());
                        //chunksPromises.push(chunk.downloadAsync(this.resourcesUrl));
                        const atlasData = this.offsets[chunk.lib].data.atlas;
                        const atlasImg = this.offsets[chunk.lib].atlas;
                        chunksPromises.push(chunk.extractFromAtlas(atlasData, atlasImg));
                    } else {
                        let flippedType = this.partsets.partSet[chunk.type]['flipped-set-type'];
                        if (flippedType !== "") {
                            chunk.resType = flippedType;
                        }
                        if (chunk.action === "std" && (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped)) {
                            //console.log("Not found... " + chunk.getResourceName());
                            //chunk.resType = chunk.type;
                            chunk.resAction = "spk";
                        }
                        if (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            //console.log("Not found... " + chunk.getResourceName());
                            chunk.isFlip = true;
                            chunk.resAction = chunk.action;
                            //chunk.resType = chunk.type;

                            chunk.resDirection = 6 - chunk.direction;
                        }
                        if (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            chunk.resFrame = chunk.frame + 1;
                            chunk.isFlip = false;
                        }
                        if (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            //console.log("Not found again... " + chunk.getResourceName());
                            chunk.isFlip = false;
                            chunk.resFrame = chunk.frame;
                            chunk.resAction = chunk.action;
                            //chunk.resType = chunk.type;
                            if (chunk.direction === 7) {
                                chunk.resDirection = 3;
                            }
                            if (chunk.direction === 3) {
                                chunk.resDirection = 7;
                            }
                        }
                        if (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            chunk.resFrame = chunk.frame + 1;
                            chunk.isFlip = false;
                        }
                        if (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            //console.log("Not found... " + chunk.getResourceName());
                            chunk.resAction = chunk.action;
                            chunk.resType = flippedType;
                            chunk.resDirection = chunk.direction;
                        }
                        if (chunk.action === "std" && (this.offsets[chunk.lib].data == null || this.offsets[chunk.lib].data[chunk.getResourceName()] == null || this.offsets[chunk.lib].data[chunk.getResourceName()].flipped)) { //////// ?????? CHECK THIS
                            //console.log("Not found... " + chunk.getResourceName());
                            chunk.resAction = "spk";
                            chunk.resType = chunk.type;
                        }
                        if (this.offsets[chunk.lib].data != null && this.offsets[chunk.lib].data[chunk.getResourceName()] != null && !this.offsets[chunk.lib].data[chunk.getResourceName()].flipped) {
                            //console.log("Found sprite: " + chunk.getResourceName());
                            //chunksPromises.push(chunk.downloadAsync(this.resourcesUrl));
                            const atlasData = this.offsets[chunk.lib].data.atlas;
                            const atlasImg = this.offsets[chunk.lib].atlas;
                            chunksPromises.push(chunk.extractFromAtlas(atlasData, atlasImg));
                        } else {
                            //console.log("Not found... " + chunk.getResourceName());
                        }
                    }
                }

                Promise.all(chunksPromises).catch(err => {
                    reject("Error downloading chunks");
                }).then(() => {
                    //console.log("drawing...");

                    for (let chunk of chunks) {
                        if (this.offsets[chunk.lib].data != null && this.offsets[chunk.lib].data[chunk.getResourceName()] != null) {
                            //console.log(chunk);
                            if (chunk.resource != null) {
                                let posX = -this.offsets[chunk.lib].data[chunk.getResourceName()].x;
                                let posY = (avatarInfo.rectHeight / 2) - this.offsets[chunk.lib].data[chunk.getResourceName()].y + avatarInfo.rectHeight / 2.5;
                                //console.log("x: " + posX + " - y: " + posY + " - color: " + chunk.color);

                                let img: any = chunk.resource;
                                if (chunk.color != null) {
                                    img = this.tintSprite(img, chunk.color, (isGhost ? 170 : 255));
                                }
                                if (chunk.isFlip) {
                                    posX = -(posX + img.width - avatarInfo.rectWidth + 1);
                                    img = this.flipImage(img);
                                }
                                if (tempCtx != null) {
                                    tempCtx.drawImage(img, posX, posY);
                                }
                            } else {
                                //console.log("Missing resource: " + chunk.getResourceName());
                            }
                        }
                    }

                    if (avatarInfo.isDownsampled) {
                        tempCanvas = this.downsampleImage(tempCanvas);
                    }

                    resolve(tempCanvas);
                });
            });
        });
    }

    getActivePartSet(partSet: string): any {
        const activeParts = this.partsets['activePartSet'][partSet]['activePart'];
        if (activeParts == null || activeParts.length === 0) {
            return null;
        }
        return activeParts;
    }

    getDrawOrder(action: string, direction: Direction): any {
        const drawOrder = this.draworder[action][direction];
        if (drawOrder == null || drawOrder.length === 0) {
            return null;
        }
        return drawOrder;
    }

    getPartPalette(partType: string): any {
        let partSet = this.figuredata['settype'][partType];
        if (partSet != null) {
            const paletteId = partSet['paletteid'];
            return this.figuredata['palette'][paletteId];
        }
        return null;
    }

    getPartPaletteCount(partType: string, partId: string): number {
        const partSet = this.getPartSet(partType);
        if (partSet != null) {
            const selectedPart = partSet[partId];
            if (selectedPart != null) {
                const chunks = selectedPart.part as any[];
                const maxColors = Math.max.apply(Math, chunks.map(o => o.colorindex));
                return Math.max(1, maxColors);
            }
        }
        return 1;
    }

    getPartSet(partType: string): any {
        let partSet = this.figuredata['settype'][partType];
        if (partSet != null) {
            return partSet.set;
        }
        return null;
    }

    getPartColor(figure: FigurePart): any {
        const parts: any = {};
        let partSet = this.figuredata['settype'][figure.type];
        if (partSet != null) {
            if (partSet['set'][figure.id] != null && partSet['set'][figure.id]['part'] != null) {
                for (let rawPart of partSet['set'][figure.id]['part']) {
                    const part: any = rawPart;
                    //console.log(figure);
                    //console.log(part);
                    //console.log("paletteid: " + partSet.paletteid + " colors: " + figure.colors[part.colorindex - 1]);

                    let element: any = { "index": part.index, "id": part.id, "colorable": part.colorable };
                    if (part.colorable) {
                        element.color = this.getColorByPaletteId(partSet.paletteid, figure.colors[part.colorindex - 1]);
                    }
                    if (parts[part.type] == null) {
                        parts[part.type] = [element];
                    } else {
                        parts[part.type].push(element);
                    }
                }
            }
            //r63 ?

            parts.hidden = [];
            if (partSet['set'][figure.id] != null && Array.isArray(partSet['set'][figure.id]['hidden'])) {
                for (let partType of partSet['set'][figure.id]['hidden']) {
                    parts.hidden.push(partType);
                }
            }
        }
        return parts;
    }

    getColorByPaletteId(paletteId: string, colorId: string): any {
        if (this.figuredata['palette'][paletteId] != null && this.figuredata['palette'][paletteId][colorId] != null && this.figuredata['palette'][paletteId][colorId]['color'] != null) {
            return this.figuredata['palette'][paletteId][colorId]['color'];
        }
        return null;
    }

    getPartUniqueName(type: string, partId: number): string {
        let uniqueName = this.figuremap[type][partId];
        if (uniqueName == null && type === "hrb") {
            uniqueName = this.figuremap["hr"][partId];
        }
        if (uniqueName == null) {
            uniqueName = this.figuremap[type][1];
        }
        if (uniqueName == null) {
            uniqueName = this.figuremap[type][0];
        }
        return uniqueName;
    }

    getPartResource(uniqueName: string, action: string, type: string, isSmall: boolean, partId: number, direction: Direction, frame: number, color: string) {
        let partFrame = this.getFrameNumber(type, action, frame);
        let chunk = new AvatarChunk(uniqueName, action, type, isSmall, partId, direction, partFrame, color);
        let resourceName = chunk.getResourceName();
        if (this.chunks[resourceName] != null && this.chunks[resourceName].resource != null) {
            chunk.resource = this.chunks[resourceName].resource;
            chunk.promise = this.chunks[resourceName].promise;
        } else {
            this.chunks[resourceName] = chunk;
        }
        return chunk;
    }

    getFrameNumber(type: string, action: string, frame: number) {
        const translations: any = { "wav": "Wave", "wlk": "Move", "spk": "Talk" };
        if (translations[action] != null) {
            if (this.animation[translations[action]].part[type] != null) {
                const count = this.animation[translations[action]].part[type].length;
                if (this.animation[translations[action]].part[type][frame % count] != null) {
                    return this.animation[translations[action]].part[type][frame % count].number;
                }
            }
        }
        return 0;
    }

    tintSprite(img: HTMLCanvasElement | HTMLImageElement, color: string, alpha: number): HTMLCanvasElement | null {
        let element = document.createElement('canvas');
        let c = element.getContext("2d");
        if (c == null)
            return null;

        let rgb = this.hex2rgb(color);

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

    hex2rgb(hex: string): any {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    flipImage(img: HTMLCanvasElement | HTMLImageElement): HTMLCanvasElement | null {
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

    downsampleImage(img: HTMLCanvasElement | HTMLImageElement): HTMLCanvasElement | null {
        let element = document.createElement('canvas');
        let c = element.getContext("2d");
        if (c == null)
            return null;

        let width = img.width;
        let height = img.height;
        element.width = width;
        element.height = height;

        c.save();
        c.scale(0.5, 0.5);
        c.drawImage(img, 0, 0);
        c.restore();

        return element;
    }
}
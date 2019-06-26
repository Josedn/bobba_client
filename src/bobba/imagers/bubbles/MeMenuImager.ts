const BASE_IMAGE_URL = "assets/memenu/base.png";
const POINTER_IMAGE_URL = "assets/memenu/pointer.png";

export default class MeMenuImager {
    baseImage?: HTMLImageElement;
    pointerImage?: HTMLImageElement;

    initialize(): Promise<void[]> {
        return Promise.all([
            this._downloadImageAsync(BASE_IMAGE_URL).then(img => {
                this.baseImage = img;
            }),
            this._downloadImageAsync(POINTER_IMAGE_URL).then(img => {
                this.pointerImage = img;
            })
        ]);
    }

    _downloadImageAsync(resourceName: string): Promise<HTMLImageElement> {
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
        img.src = resourceName;
        return d;
    }

    generateSign(username: string): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const FONT = "400 12px Ubuntu";

        if (tempCtx != null && this.baseImage != null && this.pointerImage != null) {
            tempCtx.font = FONT;
            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "white";

            const right_width = 18;
            const textMarginX = 18;
            const textMarginY = 7;

            const textWidth = Math.round(tempCtx.measureText(username).width);

            tempCanvas.width = textMarginX + textWidth + right_width;
            tempCanvas.height = this.baseImage.height + this.pointerImage.height;

            tempCtx.drawImage(this.baseImage, 0, 0, textMarginX, this.baseImage.height, 0, 0, textMarginX, this.baseImage.height);

            for (let i = textMarginX; i < textMarginX + textWidth; i++) {
                tempCtx.drawImage(this.baseImage, 32, 0, 1, this.baseImage.height, i, 0, 1, this.baseImage.height);
            }

            //Right side
            tempCtx.drawImage(this.baseImage, this.baseImage.width - right_width, 0, right_width, this.baseImage.height, textMarginX + textWidth, 0, right_width, this.baseImage.height);

            tempCtx.font = FONT;
            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "white";

            tempCtx.drawImage(this.pointerImage, Math.floor(textWidth / 2) + textMarginX - 6, 24);

            tempCtx.fillText(username, textMarginX, textMarginY);
        }

        return tempCanvas;
    }
}
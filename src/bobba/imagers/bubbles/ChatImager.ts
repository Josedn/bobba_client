import ChatStyle, { RegPoints } from "./ChatStyle";

export default class ChatImager {
    chatStyles: ChatStyleDictionary;

    constructor() {
        this.chatStyles = {};
    }

    initialize(): Promise<void> {
        const base = "assets/normal_chat/style_normal_chat_bubble_base.png";
        const color = "assets/normal_chat/style_normal_chat_bubble_color.png";
        const pointer = "assets/normal_chat/style_normal_chat_bubble_pointer.png";
        const regpoints = "assets/normal_chat/regpoints.json";
        return this._downloadChatStyle(regpoints, base, pointer, color).then(style => {
            this.chatStyles[0] = style;
        });
    }

    _downloadChatStyle(regPoints: string, base: string, pointer: string, color: string): Promise<ChatStyle> {
        return this._fetchJsonAsync(regPoints)
            .then(regPointsData => this._downloadImageAsync(base)
                .then(baseData => this._downloadImageAsync(pointer)
                    .then(pointerData => this._downloadImageAsync(color).then(colorData => new ChatStyle(regPointsData as RegPoints, baseData, pointerData, colorData)))));
    }

    _fetchJsonAsync(URL: string): Promise<object> {
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

    _getStyle(id: number): ChatStyle {
        const style = this.chatStyles[id];
        if (style != null) {
            return style;
        }
        return this.chatStyles[0];
    }

    generateChatBubble(id: number, username: string, message: string, color: number, headImage: HTMLCanvasElement): HTMLCanvasElement {
        const style = this._getStyle(id);
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const FONT = "400 13px Ubuntu";
        const FONT_BOLD = "600 13px Ubuntu";
        if (tempCtx != null) {
            tempCtx.font = FONT_BOLD;
            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "black";

            const right_width = 5;
            const textMarginX = 32;
            const textMarginY = 6;
            const baseStartX = 24;

            const usernameWidth = Math.round(tempCtx.measureText(username + ": ").width);
            tempCtx.font = FONT;
            const messageWidth = Math.round(tempCtx.measureText(message).width + 5);
            const textWidth = usernameWidth + messageWidth;

            tempCanvas.width = textMarginX + textWidth + right_width;
            tempCanvas.height = style.base.height;

            for (let i = baseStartX; i < textMarginX + textWidth; i++) {
                tempCtx.drawImage(style.base, 32, 0, 1, style.base.height, i, 0, 1, style.base.height);
            }

            //Right side
            tempCtx.drawImage(style.base, style.base.width - right_width, 0, right_width, style.base.height, textMarginX + textWidth, 0, right_width, style.base.height);

            tempCtx.textBaseline = "top";
            tempCtx.fillStyle = "black";
            tempCtx.font = FONT_BOLD;

            tempCtx.fillText(username + ": ", textMarginX, textMarginY);

            tempCtx.font = FONT;
            tempCtx.fillText(message, textMarginX + usernameWidth, textMarginY);

            const colored = this._tintSprite(style.color, color);
            tempCtx.drawImage(colored, 0, 0);
            tempCtx.drawImage(headImage, -3, -7);
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

    _tintSprite(img: HTMLCanvasElement | HTMLImageElement, color: number): HTMLCanvasElement | HTMLImageElement {
        let element = document.createElement('canvas');
        let c = element.getContext("2d");
        if (c == null) {
            return img;
        }

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
                    //imageData.data[inpos - 1] = alpha; //A
                    imageData.data[inpos - 2] = Math.round(rgb.b * imageData.data[inpos - 2] / 255); //B
                    imageData.data[inpos - 3] = Math.round(rgb.g * imageData.data[inpos - 3] / 255); //G
                    imageData.data[inpos - 4] = Math.round(rgb.r * imageData.data[inpos - 4] / 255); //R
                }
            }
        }
        c.putImageData(imageData, 0, 0);
        return element;
    }
}
interface ChatStyleDictionary {
    [id: number]: ChatStyle
}
interface RGB {
    r: number, g: number, b: number
}
import * as PIXI from 'pixi.js-legacy';

export default class MainEngine {
    pixiApp: PIXI.Application;
    logicPixiApp: PIXI.Application;
    onResizeHandler: () => void;
    onMouseMoveHandler: (mouseX: number, mouseY: number, isDrag: boolean) => void;
    onTouchStartHandler: (mouseX: number, mouseY: number) => void;
    onTouchMoveHandler: (mouseX: number, mouseY: number) => void;
    onMouseClickHandler: (mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) => void;
    onMouseDoubleClickHandler: (mouseX: number, mouseY: number) => void;
    isMouseDragging: boolean;
    globalTextures: TextureDictionary;

    constructor(gameLoop: Function, onResize: () => void,
        onMouseMove: (mouseX: number, mouseY: number, isDrag: boolean) => void,
        onTouchStart: (mouseX: number, mouseY: number) => void,
        onTouchMove: (mouseX: number, mouseY: number) => void,
        onMouseClick: (mouseX: number, mouseY: number, shiftKey: boolean, ctrlKey: boolean, altKey: boolean) => void,
        onMouseDoubleClick: (mouseX: number, mouseY: number) => void) {
        this.isMouseDragging = false;
        this.onResizeHandler = onResize;
        this.onMouseMoveHandler = onMouseMove;
        this.onTouchMoveHandler = onTouchMove;
        this.onTouchStartHandler = onTouchStart;
        this.onMouseClickHandler = onMouseClick;
        this.onMouseDoubleClickHandler = onMouseDoubleClick;
        this.globalTextures = {};

        const logicApp = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        app.renderer.autoResize = true;
        logicApp.renderer.autoResize = true;

        app.ticker.add(delta => gameLoop(delta));
        app.ticker.minFPS = 0;

        this.pixiApp = app;
        this.logicPixiApp = logicApp;

        window.addEventListener('resize', this.onResize, false);

        this.setMouseInteractions();
    }

    loadGlobalTextures(texturesUrl: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = PIXI.Loader.shared;
            loader.add(texturesUrl);
            loader.load((loader, resources) => {
                for (let resourceId in resources) {
                    const res = resources[resourceId];
                    if (res !== undefined) {
                        this.globalTextures[resourceId] = res.texture;
                    }
                }
            });

            loader.onError.add(() => reject('Cannot load global textures'));
            loader.onComplete.add(() => resolve());
        });
    }

    onEnterRoom() {
        document.body.appendChild(this.pixiApp.view);
    }

    onLeaveRoom() {
        document.body.removeChild(this.pixiApp.view);
    }

    getTextureFromImage(img: HTMLImageElement | HTMLCanvasElement): PIXI.Texture {
        let base = new PIXI.BaseTexture(img),
            texture = new PIXI.Texture(base);
        return texture;
    }

    getTexture(name: string): PIXI.Texture {
        return this.globalTextures[name];
    }

    onResize = () => {
        this.pixiApp.renderer.resize(MainEngine.getViewportWidth(), MainEngine.getViewportHeight());
        this.logicPixiApp.renderer.resize(MainEngine.getViewportWidth(), MainEngine.getViewportHeight());
        this.onResizeHandler();
    }

    getMainStage(): PIXI.Container {
        return this.pixiApp.stage;
    }

    getLogicStage(): PIXI.Container {
        return this.logicPixiApp.stage;
    }

    static getViewportWidth(): number {
        return window.innerWidth;
    }

    static getViewportHeight(): number {
        return window.innerHeight;
    }

    setMouseInteractions = () => {

        this.pixiApp.view.addEventListener('mousemove', (evt) => {
            this.onMouseMoveHandler(evt.x, evt.y, this.isMouseDragging);
        }, false);
        this.pixiApp.view.addEventListener('click', (evt) => {
            this.onMouseClickHandler(evt.x, evt.y, evt.shiftKey, evt.ctrlKey, evt.altKey);
        }, false);
        this.pixiApp.view.addEventListener('dblclick', (evt) => {
            this.onMouseDoubleClickHandler(evt.x, evt.y);
        }, false);

        this.pixiApp.view.addEventListener('touchstart', (evt) => {
            evt.preventDefault();
            if (evt.touches.length === 1) {
                this.onTouchStartHandler(evt.touches[0].clientX, evt.touches[0].clientY);
            }
        }, false);
        this.pixiApp.view.addEventListener('touchmove', (evt) => {
            evt.preventDefault();
            if (evt.touches.length === 1) {
                this.onTouchMoveHandler(evt.touches[0].clientX, evt.touches[0].clientY);
            }
        }, false);
        this.pixiApp.view.addEventListener('mousedown', (evt) => {
            this.isMouseDragging = true;
        }, false);
        this.pixiApp.view.addEventListener('mouseup', (evt) => {
            this.isMouseDragging = false;
        }, false);


    }
}

export interface TextureDictionary {
    [id: string]: PIXI.Texture;
}
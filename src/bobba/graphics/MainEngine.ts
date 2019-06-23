import * as PIXI from 'pixi.js';

export default class MainEngine {
    pixiApp: PIXI.Application;
    onResizeHandler: Function;
    onMouseMoveHandler: Function;
    onTouchStartHandler: Function;
    onTouchMoveHandler: Function;
    onMouseClickHandler: Function;
    onMouseDoubleClickHandler: Function;
    isMouseDragging: boolean;
    globalTextures: TextureDictionary;

    constructor(gameLoop: Function, onResize: Function, onMouseMove: Function, onTouchStart: Function, onTouchMove: Function, onMouseClick: Function, onMouseDoubleClick: Function) {
        this.isMouseDragging = false;
        this.onResizeHandler = onResize;
        this.onMouseMoveHandler = onMouseMove;
        this.onTouchMoveHandler = onTouchMove;
        this.onTouchStartHandler = onTouchStart;
        this.onMouseClickHandler = onMouseClick;
        this.onMouseDoubleClickHandler = onMouseDoubleClick;
        this.globalTextures = {};

        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        app.renderer.autoResize = true;
        //app.renderer.backgroundColor = 0x061639;

        app.ticker.add(delta => gameLoop(delta));
        app.ticker.minFPS = 0;
        document.body.appendChild(app.view);

        this.pixiApp = app;

        window.addEventListener('resize', this.onResize, false);

        this.setMouseInteractions();
    }

    loadGlobalTextures(texturesUrl: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const loader = PIXI.Loader.shared;
            loader.add(texturesUrl);
            loader.load((loader: PIXI.Loader, resources: any) => {
                for (let resourceId in resources) {
                    this.globalTextures[resourceId] = resources[resourceId].texture;
                }
            });

            loader.onError.add(() => reject('Cannot load global textures'));
            loader.onComplete.add(() => resolve());
        });
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
        this.onResizeHandler();
    }

    getMainStage(): PIXI.Container {
        return this.pixiApp.stage;
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
        this.pixiApp.view.addEventListener('mousedown', (evt) => {
            this.isMouseDragging = true;
        }, false);
        this.pixiApp.view.addEventListener('mouseup', (evt) => {
            this.isMouseDragging = false;
        }, false);
        this.pixiApp.view.addEventListener('touchmove', (evt) => {
            if (evt.touches.length === 1) {
                this.onTouchMoveHandler(evt.touches[0].clientX, evt.touches[0].clientY);
            }
        }, false);
        this.pixiApp.view.addEventListener('touchstart', (evt) => {
            if (evt.touches.length === 1) {
                this.onTouchStartHandler(evt.touches[0].clientX, evt.touches[0].clientY);
            }
        }, false);
        this.pixiApp.view.addEventListener('click', (evt) => {
            this.onMouseClickHandler(evt.x, evt.y);
        }, false);
        this.pixiApp.view.addEventListener('dblclick', (evt) => {
            this.onMouseDoubleClickHandler(evt.x, evt.y);
        }, false);
    }
}

export interface TextureDictionary {
    [id: string]: PIXI.Texture;
}
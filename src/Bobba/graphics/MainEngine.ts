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

    constructor(gameLoop: Function, onResize: Function, onMouseMove: Function, onTouchStart: Function, onTouchMove: Function, onMouseClick: Function, onMouseDoubleClick: Function) {
        this.isMouseDragging = false;
        this.onResizeHandler = onResize;
        this.onMouseMoveHandler = onMouseMove;
        this.onTouchMoveHandler = onTouchMove;
        this.onTouchStartHandler = onTouchStart;
        this.onMouseClickHandler = onMouseClick;
        this.onMouseDoubleClickHandler = onMouseDoubleClick;

        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        app.renderer.autoResize = true;
        app.renderer.backgroundColor = 0x061639;

        app.ticker.add(delta => gameLoop(delta));
        document.body.appendChild(app.view);

        this.pixiApp = app;

        window.addEventListener('resize', this.onResize, false);

        this.setMouseInteractions();
    }

    loadResource(item: any, callback: Function) {
        PIXI.loader
            .add(item)
            .load((loader, resources) => callback(loader, resources));
    }

    getResource(name: string): PIXI.loaders.Resource {
        return PIXI.loader.resources[name];
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
            if (evt.touches.length == 1) {
                this.onTouchMoveHandler(evt.touches[0].clientX, evt.touches[0].clientY);
            }
        }, false);
        this.pixiApp.view.addEventListener('touchstart', (evt) => {
            if (evt.touches.length == 1) {
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
import * as PIXI from 'pixi.js';

export default class MainEngine {
    pixiApp: PIXI.Application;
    onResizeHandler: Function;

    constructor(gameLoop: Function, onResize: Function) {

        this.onResizeHandler = onResize;

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
}
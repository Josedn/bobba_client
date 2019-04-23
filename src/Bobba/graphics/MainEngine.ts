import * as PIXI from 'pixi.js';

export default class MainEngine {
    pixiApp: PIXI.Application;

    constructor(gameLoop: Function) {
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
        //window.addEventListener('resize', onResize, false);
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
import * as PIXI from 'pixi.js';
import Room from "./rooms/Room";
import RoomModel from "./rooms/RoomModel";

export default class Game {
    currentRoom: Room | null;
    pixiApp: PIXI.Application | null;

    constructor() {
        this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
        this.pixiApp = null;
        this.initializeGfx();
    }

    initializeGfx() {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false,
            transparent: false,
            resolution: 1,
        });

        app.renderer.autoResize = true;
        app.renderer.backgroundColor = 0x061639;

        app.ticker.add(delta => this.gameLoop(delta));
        document.body.appendChild(app.view);

        window.addEventListener('resize', this.onResize, false);

        this.pixiApp = app;
    }

    gameLoop(delta: number) {
        if (this.currentRoom != null) {
            this.currentRoom.tick(delta);
        }
    }

    onResize() {
        if (this.pixiApp != null) {
            //this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }
}
import Room from "./rooms/Room";
// eslint-disable-next-line
import RoomModel from "./rooms/RoomModel";
import MainEngine from './graphics/MainEngine';
import GenericSprites from "./graphics/GenericSprites";
import AvatarImager from "./imagers/avatars/AvatarImager";
// eslint-disable-next-line
import { TextureDictionary, loadGhostTextures } from "./imagers/avatars/AvatarHelper";
//import PromiseQueue from "./misc/PromiseQueue";
import FurniImager from "./imagers/furniture/FurniImager";

export default class Game {
    currentRoom: Room | null;
    engine: MainEngine;
    avatarImager: AvatarImager;
    furniImager: FurniImager;
    ghostTextures: TextureDictionary | null;
    //promiseQueue: PromiseQueue;

    constructor() {
        this.engine = new MainEngine(this.gameLoop, this.onResize, this.onMouseMove, this.onTouchStart, this.onTouchMove, this.onMouseClick, this.onMouseDoubleClick);
        this.currentRoom = null;
        this.ghostTextures = null;
        //this.promiseQueue = new PromiseQueue();
        this.avatarImager = new AvatarImager();
        this.furniImager = new FurniImager();
        this.loadGame();
    }

    loadGame() {
        const sprites: string[] = [
            GenericSprites.ROOM_TILE,
            GenericSprites.ROOM_SELECTED_TILE,
        ];

        Promise.all([
            this.avatarImager.initialize(),
            this.furniImager.initialize(),
            this.engine.loadResource(sprites)
        ]).then(() => {
            this.furniImager.generateItem('roomitem', 1623);
            /*loadGhostTextures(this.avatarImager, this.engine).then(ghostTextures => {
                this.ghostTextures = ghostTextures;
                this.currentRoom = new Room(1, "Dummy room", RoomModel.getDummyRoomModel());
                //this.currentRoom.roomUserManager.addUserToRoom(1, 4, 4, 0, 0, "Relv", "hd-190-10.lg-3023-1408.ch-215-91.hr-893-45");
                //this.currentRoom.roomUserManager.addUserToRoom(2, 4, 6, 0, 4, "Grav", "ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10");

                this.furniImager.generateItem('roomitem', 13);
            });*/
        }).catch((err) => {
            console.log("Error loading game:" + err);
        });
    }

    onMouseMove = (x: number, y: number, isMouseDragging: boolean) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseMovement(x, y, isMouseDragging);
        }
    }

    onTouchStart = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleTouchStart(x, y);
        }
    }

    onTouchMove = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleTouchMove(x, y);
        }
    }

    onMouseClick = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseClick(x, y);
        }
    }

    onMouseDoubleClick = (x: number, y: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.handleMouseDoubleClick(x, y);
        }
    }

    onResize = () => {
        if (this.currentRoom != null) {
            this.currentRoom.engine.onResize();
        }
    }

    gameLoop = (delta: number) => {
        if (this.currentRoom != null) {
            this.currentRoom.tick(delta);
        }
    }
}
import RoomUser from "../users/RoomUser";
import { Sprite } from 'pixi.js-legacy';

export default class Chat {
    message: string;
    roomUser: RoomUser;
    sprite: Sprite;
    deltaY: number;
    targetY: number;

    constructor(message: string, roomUser: RoomUser, sprite: Sprite) {
        this.message = message;
        this.roomUser = roomUser;
        this.sprite = sprite;
        this.deltaY = sprite.y;
        this.targetY = sprite.y;
    }

    move(delta: number) {
        delta = delta / 1000;
        if (this.targetY < this.deltaY) { 
            this.deltaY -= SPEED * delta;
            if (this.deltaY < this.targetY) {
                this.deltaY = this.targetY;
            }
            this.updateSpritePosition();
        }
    }

    updateSpritePosition() {
        this.sprite.y = this.deltaY;
    }
}

const SPEED = 92;
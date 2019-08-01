import Chat from "./Chat";
import Room from "../Room";
import { Container, Sprite } from 'pixi.js-legacy';
import BobbaEnvironment from "../../BobbaEnvironment";

export default class ChatManager {
    chats: Chat[];
    room: Room;
    container: Container;
    _chatRollerCounter: number;
    _needsRoll: boolean;

    constructor(room: Room) {
        this.chats = [];
        this.room = room;
        this.container = new Container();
        this._chatRollerCounter = 0;
        this._needsRoll = false;
    }

    rollChats(amount: number) {
        for (let chat of this.chats) {
            chat.targetY -= (23 * amount);
        }
        this._chatRollerCounter = 0;
        this._needsRoll = false;
    }

    addChat(userId: number, message: string) {
        const roomUser = this.room.roomUserManager.getUser(userId);
        if (roomUser != null) {
            const image = BobbaEnvironment.getGame().chatImager.generateChatBubble(0, roomUser.user.name, message, roomUser.avatarContainer.color, roomUser.avatarContainer.headImage);
            const sprite = new Sprite(BobbaEnvironment.getGame().engine.getTextureFromImage(image));
            sprite.interactive = true;
            sprite.on('click', () => { roomUser.handleClick(0) });
            sprite.on('tap', () => { roomUser.handleClick(0) });
            sprite.cursor = 'pointer';

            roomUser.speak(1.5);

            sprite.x = Math.floor(roomUser.getSpriteX() - (sprite.width / 2));
            sprite.y = -100;
            if (this._needsRoll) {
                this.rollChats(1);
            }

            this.chats.push(new Chat(message, roomUser, sprite));
            this.container.addChild(sprite);
            this._needsRoll = true;
        }
    }

    tick(delta: number) {
        this._chatRollerCounter += delta;
        if (this._chatRollerCounter > ROLL_PERIOD) {
            this.rollChats(Math.round(this._chatRollerCounter / ROLL_PERIOD));
            this._chatRollerCounter = 0;
        }
        for (let chat of this.chats) {
            chat.move(delta);
        }
    }
}

const ROLL_PERIOD = 5000;
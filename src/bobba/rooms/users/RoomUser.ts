import { Container, Sprite } from "pixi.js";
//import BobbaEnvironment from "../../BobbaEnvironment";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import AvatarContainer from "./AvatarContainer";
import BobbaEnvironment from "../../BobbaEnvironment";

const ROOM_USER_SPRITE_OFFSET_X = 3;
const ROOM_USER_SPRITE_OFFSET_Y = -85;

export default class RoomUser {
    id: number;
    name: string;
    look: string;

    _x: number;
    _y: number;
    _z: number;
    rot: Direction;

    avatarContainer: AvatarContainer;
    container: Container;
    headSprite: Sprite;
    bodySprite: Sprite;
    loaded: boolean;

    room: Room;

    constructor(id: number, name: string, look: string, x: number, y: number, z: number, rot: Direction, room: Room) {
        this.id = id;
        this.name = name;
        this.look = look;

        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.room = room;

        this.loaded = false;

        this.bodySprite = new Sprite();
        this.headSprite = new Sprite();
        this.container = new Container();
        this.container.addChild(this.bodySprite);
        this.container.addChild(this.headSprite);
        this.avatarContainer = new AvatarContainer(look);
        //this.container.interactive = true;
        //this.container.on('click', this.handleClick);

        this.updateTexture();
        this.updateSpritePosition();
        this.loadTextures();
    }

    get x(): number {
        return this._x;
    }
    set x(value: number) {
        this._x = value;
        this.updateSpritePosition();
    }

    get y(): number {
        return this._y;
    }
    set y(value: number) {
        this._y = value;
        this.updateSpritePosition();
    }

    get z(): number {
        return this._z;
    }
    set z(value: number) {
        this._z = value;
        this.updateSpritePosition();
    }

    tick(delta: number) {

    }

    handleClick() {
        console.log("click on " + this.name);
    }

    loadTextures() {
        return this.avatarContainer.initialize().then(() => {
            this.loaded = true;
            this.updateTexture();
        });
    }

    updateTexture() {
        if (this.loaded) {
            this.bodySprite.texture = this.avatarContainer.getBodyTexture(this.rot, ["std"], 0);
            this.headSprite.texture = this.avatarContainer.getHeadTexture(this.rot, "std", 0);
        } else {
            this.bodySprite.texture = BobbaEnvironment.getGame().ghostTextures.getBodyTexture(this.rot, ["std"], 0);
            this.headSprite.texture = BobbaEnvironment.getGame().ghostTextures.getHeadTexture(this.rot, "std", 0);
        }
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        const offsetX = (this.rot === 6 || this.rot === 5 || this.rot === 4) ? ROOM_USER_SPRITE_OFFSET_X : 0;
        this.container.x = x + offsetX;
        this.container.y = y + ROOM_USER_SPRITE_OFFSET_Y;
    }
}
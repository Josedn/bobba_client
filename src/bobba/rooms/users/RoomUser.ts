import BobbaEnvironment from "../../BobbaEnvironment";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import { Texture, Sprite } from "pixi.js";
import Room from "../Room";
import { loadAvatarTextures, getAvatarSpriteKey } from "../../imagers/avatars/AvatarHelper";

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

    textures: TextureDictionary | null;
    sprite: Sprite;
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
        this.sprite = new Sprite();
        this.sprite.interactive = true;
        this.sprite.on('click', (event) => this.handleClick());
        const game = BobbaEnvironment.getGame();
        this.textures = game.ghostTextures;
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

    loadTextures(): Promise<any> {
        const game = BobbaEnvironment.getGame();
        return loadAvatarTextures(game.avatarImager, game.engine, this.look, false).then(textures => {
            this.textures = textures;
            this.loaded = true;
            this.updateTexture();
        });
    }

    updateTexture() {
        if (this.textures != null) {
            const texture = this.textures[this.getCurrentAvatarSpriteKey()];
            if (texture != null)
                this.sprite.texture = texture;
        }
    }

    getCurrentAvatarSpriteKey() {
        return getAvatarSpriteKey(this.rot, this.rot, ["std"], "std", 0);
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z);
        const offsetX = (this.rot === 6 || this.rot === 5 || this.rot === 4) ? ROOM_USER_SPRITE_OFFSET_X : 0;
        this.sprite.x = x + offsetX;
        this.sprite.y = y + ROOM_USER_SPRITE_OFFSET_Y;
    }
}

interface TextureDictionary {
    [id: string]: Texture;
}
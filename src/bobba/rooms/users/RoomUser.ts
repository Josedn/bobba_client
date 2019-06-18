import { Container, Sprite } from "pixi.js";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import AvatarContainer from "./AvatarContainer";
import BobbaEnvironment from "../../BobbaEnvironment";
import RequestLookAt from "../../communication/outgoing/rooms/RequestLookAt";
import { calculateZIndexUser } from "../RoomEngine";

const FRAME_SPEED = 100;
const WALK_SPEED = 2; //Squares per second

const ROOM_USER_SPRITE_OFFSET_X = 3;
const ROOM_USER_SPRITE_OFFSET_Y = -85;

export default class RoomUser {
    id: number;
    name: string;
    look: string;

    _x: number;
    _y: number;
    _z: number;
    _seatZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;

    rot: Direction;
    headRot: Direction;
    status: StatusContainer;

    _frame: number;
    _frameCounter: number;
    _waveCounter: number;
    _speakCounter: number;

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
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
        this._seatZ = 0;
        this.rot = rot;
        this.headRot = rot;
        this.room = room;
        this.status = {};

        this._frame = 0;
        this._frameCounter = 0;
        this._waveCounter = 0;
        this._speakCounter = 0;

        this.loaded = false;

        this.bodySprite = new Sprite();
        this.headSprite = new Sprite();
        this.container = new Container();
        this.container.addChild(this.bodySprite);
        this.container.addChild(this.headSprite);
        this.avatarContainer = new AvatarContainer(look);
        this.bodySprite.interactive = true;
        this.bodySprite.on('click', this.handleClick);

        this.updateTexture();
        this.updateSpritePosition();
        this.loadTextures();
    }

    _nextPrivateFrame() {
        this._frame++;
        this.updateTexture();
    }

    tick(delta: number) {
        this._frameCounter += delta;
        if (this._frameCounter >= FRAME_SPEED) {
            this._nextPrivateFrame();
            this._frameCounter = 0;
        }

        if (this._waveCounter > 0) {
            this._waveCounter -= delta;
        }

        if (this._speakCounter > 0) {
            this._speakCounter -= delta;
        }

        if (this.isWalking()) {
            this.move(delta);
        }
    }

    handleClick = () => {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestLookAt(this.id));
    }

    wave(seconds: number) {
        this._waveCounter = seconds * 1000;
    }

    updateStatus(x: number, y: number, z: number, rot: Direction, status: StatusContainer) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.headRot = rot;
        this.updateSpritePosition();
        this.status = status;
        if (status.mv != null) {
            const coords = status.mv.split(',');
            this.setMovement(parseInt(coords[0]), parseInt(coords[1]), parseFloat(coords[2]));
        }
        if (status.sit != null) {
            this._seatZ = parseFloat(status.sit) - 1.0;
        }
        this.updateTexture();
    }
    setMovement(x: number, y: number, z: number) {
        this.targetX = x;
        this.targetY = y;
        this.targetZ = z;
    }

    isSitting() {
        return this.status.sit != null;
    }

    isWalking() {
        return this.status.mv != null;
    }

    isWaving() {
        return this._waveCounter > 0;
    }

    isSpeaking() {
        return this._speakCounter > 0;
    }

    loadTextures() {
        return this.avatarContainer.initialize().then(() => {
            this.loaded = true;
            this.updateTexture();
        });
    }

    updateTexture() {
        let action = ["std"];
        let gesture = "std";
        let bodyFrame = 0;
        let headFrame = 0;

        if (this.isSitting()) {
            action = ["sit"];
        }

        if (this.isWaving()) {
            action = ["wav"];
            bodyFrame = this._frame % 2;
        }

        if (this.isSpeaking()) {
            gesture = "spk";
            headFrame = this._frame % 2;
        } else if (this._frame % 40 < 2) {
            gesture = "eyb";
        }

        if (this.isWalking()) {
            action = ["wlk"];
            bodyFrame = this._frame % 4;
        }

        if (this.loaded) {
            this.bodySprite.texture = this.avatarContainer.getBodyTexture(this.rot, action, bodyFrame);
            this.headSprite.texture = this.avatarContainer.getHeadTexture(this.headRot, gesture, headFrame);
        } else {
            this.bodySprite.texture = BobbaEnvironment.getGame().ghostTextures.getBodyTexture(this.rot, action, bodyFrame);
            this.headSprite.texture = BobbaEnvironment.getGame().ghostTextures.getHeadTexture(this.headRot, gesture, headFrame);
        }
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z + this._seatZ);
        const offsetX = (this.rot === 6 || this.rot === 5 || this.rot === 4) ? ROOM_USER_SPRITE_OFFSET_X : 0;
        this.container.x = x + offsetX;
        this.container.y = y + ROOM_USER_SPRITE_OFFSET_Y;
        this.container.zIndex = calculateZIndexUser(this._x, this._y, this._z);
    }

    move(delta: number) {
        delta = delta / 1000;
        if (this.targetX > this._x) {
            this._x += WALK_SPEED * delta;
            if (this._x > this.targetX) {
                this._x = this.targetX;
            }
        }
        else if (this.targetX < this._x) {
            this._x += -WALK_SPEED * delta;
            if (this._x < this.targetX) {
                this._x = this.targetX;
            }
        }

        if (this.targetY > this._y) {
            this._y += WALK_SPEED * delta;
            if (this._y > this.targetY) {
                this._y = this.targetY;
            }
        }
        else if (this.targetY < this._y) {
            this._y -= WALK_SPEED * delta;
            if (this._y < this.targetY) {
                this._y = this.targetY;
            }
        }

        if (this.targetZ > this._z) {
            this._z += WALK_SPEED * delta;
            if (this._z > this.targetZ) {
                this._z = this.targetZ;
            }
        }
        else if (this.targetZ < this._z) {
            this._z -= WALK_SPEED * delta;
            if (this._z < this.targetZ) {
                this._z = this.targetZ;
            }
        }

        this.updateSpritePosition();
    }
}

export interface StatusContainer {
    sit?: string,
    mv?: string,
};
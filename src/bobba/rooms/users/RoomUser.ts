import { Container, Sprite } from 'pixi.js-legacy';
import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";
import AvatarContainer from "./AvatarContainer";
import BobbaEnvironment from "../../BobbaEnvironment";
import RequestLookAt from "../../communication/outgoing/rooms/RequestLookAt";
import { ROOM_TILE_SHADOW } from "../../graphics/GenericSprites";
import { Selectable } from "../RoomEngine";
import User from "../../users/User";

const FRAME_SPEED = 100;
const WALK_SPEED = 2; //Squares per second

const ROOM_USER_SPRITE_OFFSET_X = 3;
const ROOM_USER_SPRITE_OFFSET_Y = -85;

export default class RoomUser implements Selectable {
    user: User;
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
    _signCounter: number;

    avatarContainer: AvatarContainer;
    container: Container;
    headSprite: Sprite;
    bodySprite: Sprite;
    shadowSprite: Sprite;
    signSprite: Sprite;

    selectableContainer: Container;
    selectableHeadSprite: Sprite;
    selectableBodySprite: Sprite;

    colorId: number;

    loaded: boolean;

    room: Room;

    constructor(user: User, x: number, y: number, z: number, rot: Direction, room: Room) {
        this.user = user;
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
        this._signCounter = 0;

        this.colorId = Math.floor(Math.random() * (16777215 - 1)) + 1;

        this.loaded = false;

        this.bodySprite = new Sprite();
        this.headSprite = new Sprite();
        this.selectableBodySprite = new Sprite();
        this.selectableHeadSprite = new Sprite();

        this.shadowSprite = new Sprite(BobbaEnvironment.getGame().engine.getTexture(ROOM_TILE_SHADOW));

        this.selectableContainer = new Container();
        this.selectableContainer.addChild(this.selectableBodySprite);
        this.selectableContainer.addChild(this.selectableHeadSprite);

        const signImage = BobbaEnvironment.getGame().meMenuImager.generateSign(this.user.name);
        const signTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(signImage)

        this.signSprite = new Sprite(signTexture);
        this.signSprite.y = -20;
        this.signSprite.x = Math.floor(-signImage.width / 2 + 32);
        this.avatarContainer = new AvatarContainer(this.user.look);

        this.container = new Container();
        this.container.addChild(this.bodySprite);
        this.container.addChild(this.headSprite);
        this.container.addChild(this.signSprite);

        this.showSign(5);
        this.updateTexture();
        this.updateSpritePosition();
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

        if (this._signCounter > 0) {
            this._signCounter -= delta;
        }

        if (this.isWalking()) {
            this.move(delta);
        }
    }

    handleClick = (id: number) => {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestLookAt(this.user.id));
        this.showUserInfo(false);
    }

    showUserInfo = (isUpdate: boolean) => {
        const isMe = BobbaEnvironment.getGame().userManager.currentUser === this.user;
        BobbaEnvironment.getGame().uiManager.onSelectUser(this.user.id, this.user.name, this.user.motto, this.user.look, isMe, this.avatarContainer.userInfoImage, isUpdate);
    }

    handleHover = (id: number) => {
        this.showSign(1);
    }

    handleDoubleClick = (id: number) => {

    }

    wave(seconds: number) {
        this._waveCounter = seconds * 1000;
    }

    speak(seconds: number) {
        this._speakCounter = seconds * 1000;
    }

    showSign(seconds: number) {
        this._signCounter = seconds * 1000;
    }

    updateStatus(x: number, y: number, z: number, rot: Direction, status: StatusContainer) {
        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.headRot = rot;
        this.status = status;
        if (status.sit != null) {
            this._seatZ = parseFloat(status.sit) - 1.0;
        } else {
            this._seatZ = 0;
        }
        if (status.mv != null) {
            const coords = status.mv.split(',');
            this.setMovement(parseInt(coords[0]), parseInt(coords[1]), parseFloat(coords[2]));
            this._seatZ = 0;
        }
        this.updateTexture();
        this.updateSpritePosition();
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

    isShowingSign() {
        return this._signCounter > 0;
    }

    loadTextures(): Promise<void> {
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

            if (this.isSitting()) {
                action = ["sit", "wav"];
                bodyFrame = this._frame % 2;
            }
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

            if (this.isWaving()) {
                action = ["wlk", "wav"];
            }
        }

        this.signSprite.visible = this.isShowingSign();

        if (this.loaded) {
            this.bodySprite.texture = this.avatarContainer.getBodyTexture(this.rot, action, bodyFrame);
            this.headSprite.texture = this.avatarContainer.getHeadTexture(this.headRot, gesture, headFrame);

            this.selectableBodySprite.tint = this.colorId;
            this.selectableHeadSprite.tint = this.colorId;

            this.selectableBodySprite.texture = this.avatarContainer.getSolidBodyTexture(this.rot, action, bodyFrame);
            this.selectableHeadSprite.texture = this.avatarContainer.getSolidHeadTexture(this.headRot, gesture, headFrame);
        } else {
            this.bodySprite.texture = BobbaEnvironment.getGame().ghostTextures.getBodyTexture(this.rot, action, bodyFrame);
            this.headSprite.texture = BobbaEnvironment.getGame().ghostTextures.getHeadTexture(this.headRot, gesture, headFrame);
        }
    }

    getSpriteX() {
        return this.container.x;
    }

    updateSpritePosition() {
        const { x, y } = this.room.engine.tileToLocal(this._x, this._y, this._z + this._seatZ);
        const offsetX = (this.rot === 6 || this.rot === 5 || this.rot === 4) ? ROOM_USER_SPRITE_OFFSET_X : 0;
        this.container.x = Math.round(x + offsetX);
        this.container.y = Math.round(y + ROOM_USER_SPRITE_OFFSET_Y);

        this.selectableContainer.x = this.container.x;
        this.selectableContainer.y = this.container.y;

        let shadowZ = this._z;
        if (this.room.model.isValidTile(Math.floor(this._x), Math.floor(this._y))) {
            shadowZ = Math.min(this.room.model.heightMap[Math.floor(this._x)][Math.floor(this._y)] - 1, shadowZ);
        }
        const shadowCoords = this.room.engine.tileToLocal(this._x, this._y, shadowZ);
        this.shadowSprite.x = shadowCoords.x;
        this.shadowSprite.y = shadowCoords.y;
        this.shadowSprite.zIndex = this.room.engine.calculateZIndexUserShadow(this._x, this._y, 0);
        this.container.zIndex = this.room.engine.calculateZIndexUser(this._x, this._y, this._z);
        this.selectableContainer.zIndex = this.container.zIndex;

        //this.signSprite.x = this.container.x;
        //this.signSprite.x = this.container.y;
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
import { Direction } from "../../imagers/avatars/AvatarInfo";
import Room from "../Room";

export default class RoomItem {
    id: number;
    _x: number;
    _y: number;
    _z: number;
    rot: Direction;



    room: Room;

    constructor(id: number, x: number, y: number, z: number, rot: Direction, room: Room) {
        this.id = id;
        this._x = x;
        this._y = y;
        this._z = z;
        this.rot = rot;
        this.room = room;
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

    updateSpritePosition() {

    }

    handleClick() {
        console.log("click on furni");
    }
}
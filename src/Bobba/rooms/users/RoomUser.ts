export default class RoomUser {
    id: number;
    name: string;
    look: string;

    x: number;
    y: number;
    z: number;
    rot: number;

    constructor(id: number, name: string, look: string, x: number, y: number, z: number, rot: number) {
        this.id = id;
        this.name = name;
        this.look = look;

        this.x = x;
        this.y = y;
        this.z = z;
        this.rot = rot;
    }

    tick(delta: number) {

    }

}
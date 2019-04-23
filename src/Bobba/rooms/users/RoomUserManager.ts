import Room from "../Room";
import RoomUser from "./RoomUser";

export default class RoomUserManager {
    room: Room;
    users: RoomUserDictionary;

    constructor(room: Room) {
        this.room = room;
        this.users = {};
    }

    getUser(id: number): RoomUser | null {
        return (id in this.users) ? this.users[id] : null;
    }

    addUserToRoom(id: number, x: number, y: number, z: number, rot: number, name: string, look: string) {
        const user = this.getUser(id);
        if (user == null) {
            const newUser = new RoomUser(id, name, look, x, y, z, rot);
        } else {
            //user.updateParams(x, y...);
        }
    }

    tick(delta: number) {
        for (let key in this.users) {
            if (this.users[key] != null) {
                this.users[key].tick(delta);
            }
        }
    }
}

interface RoomUserDictionary {
    [id: number]: RoomUser;
}
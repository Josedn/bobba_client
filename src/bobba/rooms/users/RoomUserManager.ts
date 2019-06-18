import Room from "../Room";
import RoomUser, { StatusContainer } from "./RoomUser";
import { Direction } from "../../imagers/avatars/AvatarInfo";

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

    updateUserStatus(id: number, x: number, y: number, z: number, rot: Direction, status: StatusContainer) {
        const user = this.getUser(id);
        if (user != null) {
            user.updateStatus(x, y, z, rot, status);
        }
    }

    addUserToRoom(id: number, x: number, y: number, z: number, rot: Direction, name: string, look: string) {
        const user = this.getUser(id);
        if (user == null) {
            const newUser = new RoomUser(id, name, look, x, y, z, rot, this.room);
            this.room.engine.addUserContainer(id, newUser.container, newUser.shadowSprite);
            this.users[id] = newUser;
        } else {
            //user.updateParams(x, y...);
        }
    }

    userWave(id: number) {
        const user = this.getUser(id);
        if (user != null) {
            user.wave(2);
        }
    }

    removeUserFromRoom(id: number) {
        this.room.engine.removeUserSprite(id);
        if (this.getUser(id) != null) {
            delete (this.users[id]);
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
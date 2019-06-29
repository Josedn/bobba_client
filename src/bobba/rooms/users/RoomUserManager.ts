import Room from "../Room";
import RoomUser, { StatusContainer } from "./RoomUser";
import { Direction } from "../../imagers/avatars/AvatarInfo";
import BobbaEnvironment from "../../BobbaEnvironment";

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

    addUserToRoom(id: number, x: number, y: number, z: number, rot: Direction, name: string, look: string, motto: string) {
        const baseUser = BobbaEnvironment.getGame().userManager.setUser(id, name, motto, look);
        const roomUser = this.getUser(id);
        if (roomUser != null) {
            this.removeUserFromRoom(id, false);
        }
        const newUser = new RoomUser(baseUser, x, y, z, rot, this.room);
        this.room.engine.addUserContainer(id, newUser.container, newUser.shadowSprite);
        this.room.engine.addSelectableContainer(newUser.colorId, [newUser.selectableContainer], newUser);
        this.users[id] = newUser;
        newUser.loadTextures().then(()=> {
            if (roomUser != null) {
                newUser.showUserInfo(true);
            }
        });
    }

    userWave(id: number) {
        const user = this.getUser(id);
        if (user != null) {
            user.wave(2);
        }
    }

    removeUserFromRoom(id: number, notify: boolean) {
        this.room.engine.removeUserSprite(id);
        const user = this.getUser(id);
        if (user != null) {
            this.room.engine.removeSelectableContainer(user.colorId);
            if (notify) {
                BobbaEnvironment.getGame().uiManager.onCloseSelectUser(id);
            }
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
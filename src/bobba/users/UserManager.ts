import User from "./User";

export default class UserManager {
    users: UserDictionary;
    currentUser?: User;

    constructor() {
        this.users = {};
    }

    setUser(id: number, name: string, motto: string, look: string): User {
        const user = this.getUser(id);
        if (user == null) {
            this.users[id] = new User(id, name, motto, look);
        } else {
            user.look = look;
            user.motto = motto;
            user.name = name;
        }
        return this.users[id];
    }

    getUser(id: number): User | null {
        return this.users[id];
    }

    setCurrentUser(id: number, name: string, motto: string, look: string): User {
        this.currentUser = this.setUser(id, name, motto, look);
        return this.currentUser;
    }
}

interface UserDictionary {
    [id: number]: User;
}
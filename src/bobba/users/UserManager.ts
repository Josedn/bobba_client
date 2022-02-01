import User from "./User";
import BobbaEnvironment from "../BobbaEnvironment";

export enum CoinType {
    Credit, Pixel
};

export default class UserManager {
    users: UserDictionary;
    currentUser?: User;
    coins: [CoinType, number];
    clubDays: number;

    constructor() {
        this.users = {};
        this.coins = [CoinType.Credit, -1];
        this.coins = [CoinType.Pixel, -1];
        this.clubDays = 69;
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

    updateCreditsBalance(coinType: CoinType, balance: number) {
        if (this.coins[coinType] !== -1) {
            BobbaEnvironment.getGame().soundManager.playCreditsSound();
        }

        this.coins[coinType] = balance;
        
        BobbaEnvironment.getGame().uiManager.onUpdateCreditsBalance(balance);
    }
}

interface UserDictionary {
    [id: number]: User;
}
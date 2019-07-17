export enum LockType {
    Open, Locked, Password
};
export default class RoomData {
    id: number;
    name: string;
    owner: string;
    description: string;
    capacity: number;
    userCount: number;
    isFavourite: boolean;
    lockType: LockType;

    constructor(id: number, name: string, owner: string, description: string, capacity: number, userCount: number, isFavourite: boolean, lockType: LockType) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.description = description;
        this.capacity = capacity;
        this.userCount = userCount;
        this.isFavourite = isFavourite;
        this.lockType = lockType;
    }
}
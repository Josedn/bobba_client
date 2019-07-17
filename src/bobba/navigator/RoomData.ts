export default class RoomData {
    id: number;
    name: string;
    owner: string;
    description: string;
    capacity: number;
    userCount: number;

    constructor(id: number, name: string, owner: string, description: string, capacity: number, userCount: number) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.description = description;
        this.capacity = capacity;
        this.userCount = userCount;
    }
}
import RoomModel from "./RoomModel";

export default class Room {
    id: number;
    name: string;
    model: RoomModel;

    constructor(id: number, name: string, model: RoomModel) {
        this.id = id;
        this.name = name;
        this.model = model;
    }
}
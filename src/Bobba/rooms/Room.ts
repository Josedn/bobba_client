import RoomModel from "./RoomModel";
import RoomEngine from "./RoomEngine";

export default class Room {
    id: number;
    name: string;
    model: RoomModel;
    engine: RoomEngine;

    constructor(id: number, name: string, model: RoomModel) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.engine = new RoomEngine(this);
    }

    tick(delta: number) {
        this.engine.tick(delta);
    }
}
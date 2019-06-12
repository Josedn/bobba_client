import RoomModel from "./RoomModel";
import RoomEngine from "./RoomEngine";
import RoomUserManager from "./users/RoomUserManager";
import RoomItemManager from "./items/RoomItemManager";

export default class Room {
    id: number;
    name: string;
    model: RoomModel;
    engine: RoomEngine;
    roomUserManager: RoomUserManager;
    roomItemManager: RoomItemManager;

    constructor(id: number, name: string, model: RoomModel) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.roomUserManager = new RoomUserManager(this);
        this.roomItemManager = new RoomItemManager(this);
        this.engine = new RoomEngine(this);
    }

    tick(delta: number) {
        this.engine.tick(delta);
        this.roomUserManager.tick(delta);
        this.roomItemManager.tick(delta);
    }
}
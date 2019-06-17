import { TextureDictionary } from "../../graphics/MainEngine";
import AvatarInfo, { Direction } from "../../imagers/avatars/AvatarInfo";
import BobbaEnvironment from "../../BobbaEnvironment";
import { Texture } from "pixi.js";

export default class AvatarContainer {

    look: string;
    isGhost: boolean;
    bodyTextures: TextureDictionary;
    headTextures: TextureDictionary;

    constructor(look: string, isGhost?: boolean) {
        this.isGhost = isGhost !== undefined && isGhost;
        this.look = isGhost ? GHOST_LOOK : look;
        this.bodyTextures = {};
        this.headTextures = {};
    }

    initialize(): Promise<any> {
        const promises: Promise<any>[] = [];

        for (let i = 0; i <= 7; i++) {
            promises.push(this._loadUniqueHeadTexture(i as Direction, "std", 0));
            promises.push(this._loadUniqueHeadTexture(i as Direction, "eyb", 0));

            promises.push(this._loadUniqueBodyTexture(i as Direction, ["std"], 0));
            for (let j = 0; j <= 3; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wlk"], j));
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wlk", "wav"], j));
            }
            for (let j = 0; j <= 1; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wav"], j));
                promises.push(this._loadUniqueHeadTexture(i as Direction, "spk", j));
            }
        }

        for (let i = 0; i <= 7; i = i + 2) {
            promises.push(this._loadUniqueBodyTexture(i as Direction, ["sit"], 0));
            for (let j = 0; j <= 1; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["sit", "wav"], 0));
            }
        }

        return Promise.all(promises);
    }

    getHeadTexture(headDirection: Direction, gesture: string, frame: number): Texture {
        return this.headTextures[getHeadTextureKey(headDirection, gesture, frame)];
    }

    getBodyTexture(direction: Direction, action: string[], frame: number): Texture {
        return this.bodyTextures[getBodyTextureKey(direction, action, frame)];
    }

    _loadUniqueBodyTexture(direction: Direction, action: string[], frame: number): Promise<any> {
        const avatarImager = BobbaEnvironment.getGame().avatarImager;
        const engine = BobbaEnvironment.getGame().engine;

        return avatarImager.generateGeneric(new AvatarInfo(this.look, direction, direction, action, "std", frame, false, true, "n"), this.isGhost)
            .then(image => {
                this.bodyTextures[getBodyTextureKey(direction, action, frame)] = engine.getTextureFromImage(image);
            });
    }

    _loadUniqueHeadTexture(headDirection: Direction, gesture: string, frame: number): Promise<any> {
        const avatarImager = BobbaEnvironment.getGame().avatarImager;
        const engine = BobbaEnvironment.getGame().engine;

        return avatarImager.generateGeneric(new AvatarInfo(this.look, headDirection, headDirection, ["std"], gesture, frame, true, false, "n"), this.isGhost)
            .then(image => {
                this.headTextures[getHeadTextureKey(headDirection, gesture, frame)] = engine.getTextureFromImage(image);
            });
    }

}

const getBodyTextureKey = (direction: Direction, action: string[], frame: number): string => {
    let actionText = action[0];
    if (action.length > 1) {
        actionText += "-" + action[1];
    }
    return direction + "_" + actionText + "_" + frame;
};


const getHeadTextureKey = (headDirection: Direction, gesture: string, frame: number): string => {
    return headDirection + "_" + gesture + "_" + frame;
};

export const GHOST_LOOK = "hd-180-1021";
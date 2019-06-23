import { TextureDictionary } from "../../graphics/MainEngine";
import AvatarInfo, { Direction } from "../../imagers/avatars/AvatarInfo";
import BobbaEnvironment from "../../BobbaEnvironment";
import { Texture } from "pixi.js";

export default class AvatarContainer {

    look: string;
    isGhost: boolean;
    color: number;
    bodyTextures: TextureDictionary;
    headTextures: TextureDictionary;
    headImage: HTMLImageElement;

    constructor(look: string, isGhost?: boolean) {
        this.isGhost = isGhost !== undefined && isGhost;
        this.look = isGhost ? GHOST_LOOK : look;
        this.bodyTextures = {};
        this.headTextures = {};
        this.color = 0x000000;
        this.headImage = new Image();
    }

    initialize(): Promise<any> {
        const promises: Promise<any>[] = [];
        const { avatarImager } = BobbaEnvironment.getGame();

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

        promises.push(this._loadChatHeadImage());

        this.color = avatarImager.getChatColor(this.look);

        return Promise.all(promises);
    }

    getHeadTexture(headDirection: Direction, gesture: string, frame: number): Texture {
        return this.headTextures[getHeadTextureKey(headDirection, gesture, frame)];
    }

    getBodyTexture(direction: Direction, action: string[], frame: number): Texture {
        return this.bodyTextures[getBodyTextureKey(direction, action, frame)];
    }

    _loadUniqueBodyTexture(direction: Direction, action: string[], frame: number): Promise<any> {
        const { avatarImager, engine } = BobbaEnvironment.getGame();

        return avatarImager.generateGeneric(new AvatarInfo(this.look, direction, direction, action, "std", frame, false, true, "n"), this.isGhost)
            .then(image => {
                this.bodyTextures[getBodyTextureKey(direction, action, frame)] = engine.getTextureFromImage(image);
            });
    }

    _loadUniqueHeadTexture(headDirection: Direction, gesture: string, frame: number): Promise<any> {
        const { avatarImager, engine } = BobbaEnvironment.getGame();

        return avatarImager.generateGeneric(new AvatarInfo(this.look, headDirection, headDirection, ["std"], gesture, frame, true, false, "n"), this.isGhost)
            .then(image => {
                this.headTextures[getHeadTextureKey(headDirection, gesture, frame)] = engine.getTextureFromImage(image);
            });
    }

    _loadChatHeadImage(): Promise<any> {
        const { avatarImager } = BobbaEnvironment.getGame();

        return avatarImager.generateGeneric(new AvatarInfo(this.look, 2, 2, ["std"], "std", 0, true, false, "d"), this.isGhost)
            .then(image => {
                this.headImage = image;
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
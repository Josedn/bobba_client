import { Texture } from "pixi.js";
import AvatarImager from "./AvatarImager";
import MainEngine from "../../graphics/MainEngine";
import AvatarInfo, { Direction } from "./AvatarInfo";

const GHOST_LOOK = "hd-180-1021";

export const loadGhostTextures = (avatarImager: AvatarImager, engine: MainEngine): Promise<TextureDictionary> => {
    return loadAvatarTextures(avatarImager, engine, GHOST_LOOK, true);
} 

export const loadAvatarTextures = (avatarImager: AvatarImager, engine: MainEngine, look: string, isGhost: boolean): Promise<TextureDictionary> => {
    return new Promise((resolve, reject) => {
        const textures: TextureDictionary = {};
        const promises: Promise<any>[] = [];
        //std
        for (let i = 0; i <= 7; i++) {
            promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["std"], "std", 0));
            //eyb
            promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["std"], "eyb", 0));
            //spk
            for (let j = 0; j <= 1; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["std"], "spk", j));
            }
        }
        //wlk
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 3; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wlk"], "std", j));
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wlk"], "spk", j));
            }
        }
        //wav
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 1; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wav"], "std", j));
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wav"], "spk", j));
            }
        }
        //wlk-wav
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 3; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wlk", "wav"], "std", j));
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["wlk", "wav"], "spk", j));
            }
        }
        //sit
        for (let i = 0; i <= 7; i = i+2) {
            promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["sit"], "std", 0));
            //eyb
            promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["sit"], "eyb", 0));
            //spk
            for (let j = 0; j <= 1; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["sit"], "spk", j));
            }
        }
        //sit-wav
        for (let i = 0; i <= 7; i = i+2) {
            for (let j = 0; j <= 1; j++) {
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["sit", "wav"], "std", j));
                promises.push(loadUniqueTexture(avatarImager, engine, textures, isGhost, look, i as Direction, i as Direction, ["sit", "wav"], "spk", j));
            }
        }

        return Promise.all(promises).then(() => {
            resolve(textures);
        }).catch(err => {
            reject(err);
        });
    });
}

//KEY = DIRECTION_HEADDIRECTION_ACTIONS_GESTURE_FRAME
export const getAvatarSpriteKey = (direction: Direction, headDirection: Direction, action: string[], gesture: string, frame: number): string => {
    let actionText = action[0];
    if (action.length > 1) {
        actionText += "-" + action[1];
    }
    return direction + "_" + headDirection + "_" + actionText + "_" + gesture + "_" + frame;
}

const loadUniqueTexture = (avatarImager: AvatarImager, engine: MainEngine, textures: TextureDictionary, isGhost: boolean, look: string, direction: Direction, headDirection: Direction, action: string[], gesture: string, frame: number): Promise<any> => {
    if (isGhost) {
        return avatarImager.generateGhost(new AvatarInfo(look, direction, headDirection, action, gesture, frame, false, "n"))
            .then(image => {
                textures[getAvatarSpriteKey(direction, headDirection, action, gesture, frame)] = engine.getTextureFromImage(image);
            });
    } else {
        return avatarImager.generate(new AvatarInfo(look, direction, headDirection, action, gesture, frame, false, "n"))
            .then(image => {
                textures[getAvatarSpriteKey(direction, headDirection, action, gesture, frame)] = engine.getTextureFromImage(image);
            });
    }

}

export interface TextureDictionary {
    [id: string]: Texture;
}
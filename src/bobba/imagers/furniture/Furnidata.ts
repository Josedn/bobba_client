
export type RoomItemDescription = {
    id: number,
    classname: string,
    name: string,
    description: string,
    revision: number,
    canstandon: number,
    cansiton: number,
    canlayon: number,
    xdim: number,
    ydim: number,
};

export type WallItemDescription = {
    id: number,
    classname: string,
    name: string,
    description: string,
    revision: number,
};

export type Furnidata = {
    roomitemtypes: {
        [id: number]: RoomItemDescription
    },
    wallitemtypes: {
        [id: number]: WallItemDescription
    }
};

export type FurniDescription = RoomItemDescription | WallItemDescription;

export type FurnidataType = 'wallitemtypes' | 'roomitemtypes';

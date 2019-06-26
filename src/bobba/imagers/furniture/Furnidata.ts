export type FurniDescription = {
    classname: string,
    name: string,
    description: string,
};

export type Furnidata = {
    roomitemtypes: {
        [id: number]: FurniDescription
    },
    wallitemtypes: {
        [id: number]: FurniDescription
    }
};

export type FurnidataType = 'wallitemtypes' | 'roomitemtypes';
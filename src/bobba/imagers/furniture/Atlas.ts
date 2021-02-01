export type AtlasFrame = {
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    sourceSize: {
        w: number;
        h: number;
    };
    pivot: {
        x: number;
        y: number;
    };
};

export type Atlas = {
    frames: {
        [id: string]: AtlasFrame;
    },
    meta: {
        app: string;
        version: string;
        image: string;
        format: string;
        size: {
            w: number;
            h: number;
        };
        scale: number;
    };
};

export const extractImage = (atlas: Atlas, image: HTMLImageElement, sourceName: string) => {
    const currentImageData = atlas.frames[sourceName];
    // specify desired x,y,width,height
    // to be clipped from the spritesheet
    const { x, y, w, h } = currentImageData.frame;
    //const x = 178, y = 0, w = 67, h = 64;

    // create an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (ctx != null) {
        // size the canvas to the desired sub-sprite size
        canvas.width = w;
        canvas.height = h;

        // clip the sub-sprite from x,y,w,h on the spritesheet image
        // and draw the clipped sub-sprite on the canvas at 0,0
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h);

        // convert the canvas to an image
        const subsprite = new Image();
        subsprite.src = canvas.toDataURL();
        return subsprite;
    }
    return null;
};

export const extractImages = (atlas: Atlas, image: HTMLImageElement) => {
    const newImages: { [id: string]: HTMLImageElement } = {};

    for (let subImage in atlas.frames) {
        const subsprite = extractImage(atlas, image, subImage);
        if (subsprite != null) {
            newImages[subImage] = subsprite;
        }
    }
    return newImages;
};
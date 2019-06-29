export const generateSilhouette = (img: HTMLImageElement | HTMLCanvasElement, r: number, g: number, b: number): HTMLCanvasElement | HTMLImageElement => {
    const element = document.createElement('canvas');
    const c = element.getContext("2d");
    const { width, height } = img;

    if (c == null || width === 0 || height === 0) {
        return img;
    }

    element.width = width;
    element.height = height;

    c.drawImage(img, 0, 0);
    const imageData = c.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
        let inpos = y * width * 4;
        for (let x = 0; x < width; x++) {
            //const pr = imageData.data[inpos++];
            //const pg = imageData.data[inpos++];
            //const pb = imageData.data[inpos++];
            inpos += 3; //////

            const pa = imageData.data[inpos++];
            if (pa !== 0) {
                imageData.data[inpos - 1] = 255; //A
                imageData.data[inpos - 2] = b; //B
                imageData.data[inpos - 3] = g; //G
                imageData.data[inpos - 4] = r; //R
            }
        }
    }
    c.putImageData(imageData, 0, 0);
    return element;
};
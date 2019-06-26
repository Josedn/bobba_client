export const canvas2Image = (canvas: HTMLCanvasElement): HTMLImageElement => {
    const imgFoo = document.createElement('img');
    imgFoo.src = canvas.toDataURL();
    return imgFoo;
};
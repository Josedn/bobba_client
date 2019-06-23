export default class ChatStyle {
    base: HTMLImageElement;
    pointer: HTMLImageElement;
    color: HTMLImageElement;
    regPoints: RegPoints;

    constructor(regPoints: RegPoints, base: HTMLImageElement, pointer: HTMLImageElement, color: HTMLImageElement) {
        this.regPoints = regPoints;
        this.base = base;
        this.pointer = pointer;
        this.color = color;
    }
}

export interface RegPoints {
    sliceXY: number[],
    sliceWH: number[],
    colorXY: number[],
    pointerY: number,
    faceXY: number[],
    textFieldMargins: number[],
    textColorRGB: number,
    fontFace: string,
    fontSize: number,
    overlapRect: number[],
}
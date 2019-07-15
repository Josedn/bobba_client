export default class WindowManager {
    static currentZIndex = 10;

    static getNextZIndex(): number {
        console.log("currentz: " + this.currentZIndex);
        return this.currentZIndex++;
    }
}
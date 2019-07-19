export default class WindowManager {
    static currentZIndex = 10;

    static getNextZIndex(): number {
        return this.currentZIndex++;
    }
}
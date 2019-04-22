import Game from "./Game";

export default class BobbaEnvironment {
    static gameInstance: Game;
    static getGame(): Game {
        if (this.gameInstance == null) {
            this.gameInstance = new Game();
        }
        return this.gameInstance;
    }
}
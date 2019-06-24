import Game from "./Game";

export default class BobbaEnvironment {
    static _gameInstance: Game;
    static getGame(): Game {
        if (this._gameInstance == null) {
            this._gameInstance = new Game();
        }
        return this._gameInstance;
    }

    static log(message: string) {
        const element = document.getElementById('debug');
        if (element != null) {
            element.innerHTML = message;
        }
        console.log("Log: " + message);
    }

    static loadingLog(message: string) {
        const element = document.getElementById('loading_info');
        if (element != null) {
            element.innerHTML = message;
        }
        console.log("Loading: " + message);
    }
}
import Game from "../Game";
import Login from "../communication/outgoing/generic/Login";

export default class UIManager {

    game: Game;

    onLoggedInHandler: () => void;

    constructor(game: Game) {
        this.game = game;
        this.onLoggedInHandler = () => { };
    }

    doChat(chat: string) {
        const { currentRoom } = this.game;
        if (currentRoom != null && chat.length > 0) {
            currentRoom.chat(chat);
        }
    }

    doLogin(username: string, look: string) {
        this.game.communicationManager.sendMessage(new Login(username, look));
    }

    setLoggedInHandler(handler: () => void) {
        this.onLoggedInHandler = handler;
    }
}
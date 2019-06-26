import Game from "../Game";
import Login from "../communication/outgoing/generic/Login";

export default class UIManager {
    game: Game;

    onLoggedIn: () => void;
    onSelectFurni: FurniInfo;
    onSelectUser: UserInfo;

    constructor(game: Game) {
        this.game = game;
        this.onLoggedIn = () => { };
        this.onSelectFurni = () => { };
        this.onSelectUser = () => { };
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

    doFurniInteract(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            const item = currentRoom.roomItemManager.getItem(itemId);
            if (item != null) {
                item.handleDoubleClick(0);
            }
        }
    }

    doFurniPickUp(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            const item = currentRoom.roomItemManager.getItem(itemId);
            if (item != null) {
                //item.handleDoubleClick(0);
            }
        }
    }
    doFurniRotate(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            const item = currentRoom.roomItemManager.getItem(itemId);
            if (item != null) {
                //item.handleDoubleClick(0);
            }
        }
    }
    doFurniMove(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            const item = currentRoom.roomItemManager.getItem(itemId);
            if (item != null) {
                //item.handleDoubleClick(0);
            }
        }
    }

    doWave() {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            currentRoom.wave();
        }
    }

    setLoggedInHandler(handler: () => void) {
        this.onLoggedIn = handler;
    }

    setOnSelectFurni(handler: FurniInfo) {
        this.onSelectFurni = handler;
    }

    setOnSelectUser(handler: UserInfo) {
        this.onSelectUser = handler;
    }
}

export type FurniInfo = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement) => void;
export type UserInfo = (id: number, name: string, motto: string, image: HTMLCanvasElement) => void;
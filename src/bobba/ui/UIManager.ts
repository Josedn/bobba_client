import Game from "../Game";
import Login from "../communication/outgoing/generic/Login";
import User from "../users/User";
import RequestChangeLooks from "../communication/outgoing/rooms/RequestChangeLooks";
import RequestChangeMotto from "../communication/outgoing/rooms/RequestChangeMotto";

export default class UIManager {
    game: Game;

    onLoggedIn: (user: User) => void;
    onSelectFurni: FurniInfo;
    onSelectUser: UserInfo;
    onCloseSelectFurni: (furniId: number) => void;
    onCloseSelectUser: (userId: number) => void;
    onLoadPost: (text: string) => void;
    onFocusChat: () => void;
    onGameStop: () => void;
    onOpenChangeLooks: (figure: string) => void;

    constructor(game: Game) {
        this.game = game;
        this.onLoggedIn = () => { };
        this.onSelectFurni = () => { };
        this.onSelectUser = () => { };
        this.onLoadPost = () => { };
        this.onFocusChat = () => { };
        this.onGameStop = () => { };
        this.onCloseSelectFurni = () => { };
        this.onCloseSelectUser = () => { };
        this.onOpenChangeLooks = () => { };
    }

    log(text: string) {
        console.log("Log: " + text);
    }

    postLoading(text: string) {
        console.log("Loading: " + text);
        this.onLoadPost(text);
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
                item.pickUp();
            }
        }
    }
    doFurniRotate(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            const item = currentRoom.roomItemManager.getItem(itemId);
            if (item != null) {
                item.rotate();
            }
        }
    }
    doFurniMove(itemId: number) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            currentRoom.roomItemManager.startFloorItemMovement(itemId);
        }
    }

    doWave() {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            currentRoom.wave();
        }
    }

    doChangeLooks(look: string, gender: string) {
        const { currentRoom } = this.game;
        if (currentRoom != null) {
            this.game.communicationManager.sendMessage(new RequestChangeLooks(look, gender));
        }
    }

    doOpenChangeLooks() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onOpenChangeLooks(currentUser.look);
        }
    }

    doChangeMotto(motto: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.communicationManager.sendMessage(new RequestChangeMotto(motto));
        }
    }

    setLoggedInHandler(handler: (user: User) => void) {
        this.onLoggedIn = handler;
    }

    setOnSelectFurni(handler: FurniInfo) {
        this.onSelectFurni = handler;
    }

    setOnSelectUser(handler: UserInfo) {
        this.onSelectUser = handler;
    }

    setOnCloseSelectFurniHandler(handler: () => void) {
        this.onCloseSelectFurni = handler;
    }

    setOnCloseSelectUserHandler(handler: () => void) {
        this.onCloseSelectUser = handler;
    }

    setOnLoadHandler(handler: (text: string) => void) {
        this.onLoadPost = handler;
    }

    setOnFocusChatHandler(handler: () => void) {
        this.onFocusChat = handler;
    }

    setOnGameStopHandler(handler: () => void) {
        this.onGameStop = handler;
    }

    setOnOpenChangeLooksHandler(handler: (figure: string) => void) {
        this.onOpenChangeLooks = handler;
    }
}

export type FurniInfo = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement, isUpdate: boolean) => void;
export type UserInfo = (id: number, name: string, motto: string, look: string, isMe: boolean, image: HTMLCanvasElement, isUpdate: boolean) => void;

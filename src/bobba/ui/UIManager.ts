import Game from "../Game";
import RequestLogin from "../communication/outgoing/users/RequestLogin";
import User from "../users/User";
import RequestChangeLooks from "../communication/outgoing/rooms/RequestChangeLooks";
import RequestChangeMotto from "../communication/outgoing/rooms/RequestChangeMotto";
import UserItem from "../inventory/UserItem";
import CataloguePage from "../catalogue/CataloguePage";
import { CatalogueIndex } from "../catalogue/Catalogue";

export default class UIManager {
    game: Game;
    //Log in    
    onSetUserData: (user: User) => void;
    //Room item info
    onSelectFurni: FurniInfo;
    onSelectUser: UserInfo;
    onCloseSelectFurni: (furniId: number) => void;
    onCloseSelectUser: (userId: number) => void;
    //Misc
    onFocusChat: () => void;
    onLoadPost: (text: string) => void;
    onGameStop: () => void;
    onUpdateCreditsBalance: (amount: number) => void;
    onShowNotification: (text: string) => void;
    //Change looks
    onOpenChangeLooks: (figure: string) => void;
    onCloseChangeLooks: () => void;
    //Inventory
    onOpenInventory: () => void;
    onUpdateInventory: (items: UserItem[]) => void;
    onCloseInventory: () => void;
    //Catalogue
    onOpenCatalogue: () => void;
    onLoadCataloguePage: (page: CataloguePage) => void;
    onLoadCatalogueIndex: (index: CatalogueIndex[]) => void;
    onCloseCatalogue: () => void;

    constructor(game: Game) {
        this.game = game;
        this.onSetUserData = () => { };
        this.onSelectFurni = () => { };
        this.onSelectUser = () => { };
        this.onLoadPost = () => { };
        this.onFocusChat = () => { };
        this.onGameStop = () => { };
        this.onCloseSelectFurni = () => { };
        this.onCloseSelectUser = () => { };
        this.onOpenChangeLooks = () => { };
        this.onCloseChangeLooks = () => { };
        this.onOpenInventory = () => { };
        this.onUpdateInventory = () => { };
        this.onCloseInventory = () => { };
        this.onOpenCatalogue = () => { };
        this.onLoadCataloguePage = () => { };
        this.onCloseCatalogue = () => { };
        this.onLoadCatalogueIndex = () => { };
        this.onUpdateCreditsBalance = () => { };
        this.onShowNotification = () => { };
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
        this.game.communicationManager.sendMessage(new RequestLogin(username, look));
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
            currentRoom.roomItemManager.startRoomItemMovement(itemId);
        }
    }

    doFurniPlace(itemId: number) {
        const { currentRoom, inventory } = this.game;
        if (currentRoom != null) {
            inventory.tryPlaceItem(itemId);
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

    doOpenInventory() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onOpenInventory();
            this.game.inventory.updateInventory();
        }
    }

    doChangeMotto(motto: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.communicationManager.sendMessage(new RequestChangeMotto(motto));
        }
    }

    doOpenCatalogue() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onOpenCatalogue();

        }
    }

    doRequestCataloguePage(pageId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.catalogue.requestPage(pageId);
        }
    }

    doRequestCataloguePurchase(pageId: number, itemId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.catalogue.requestPurchase(pageId, itemId);
        }
    }

    setOnSetUserDataHandler(handler: (user: User) => void) {
        this.onSetUserData = handler;
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

    setOnCloseChangeLooksHandler(handler: () => void) {
        this.onCloseChangeLooks = handler;
    }

    setOnOpenInventoryHandler(handler: () => void) {
        this.onOpenInventory = handler;
    }

    setOnUpdateInventoryHandler(handler: (items: UserItem[]) => void) {
        this.onUpdateInventory = handler;
    }

    setOnCloseInventoryHandler(handler: () => void) {
        this.onCloseInventory = handler;
    }

    setOnOpenCatalogueHandler(handler: () => void) {
        this.onOpenCatalogue = handler;
    }

    setOnCloseCatalogueHandler(handler: () => void) {
        this.onCloseCatalogue = handler;
    }

    setOnLoadCataloguePageHandler(handler: (page: CataloguePage) => void) {
        this.onLoadCataloguePage = handler;
    }

    setOnLoadCatalogueIndexHandler(handler: (index: CatalogueIndex[]) => void) {
        this.onLoadCatalogueIndex = handler;
    }

    setOnUpdateCreditsBalanceHandler(handler: (amount: number) => void) {
        this.onUpdateCreditsBalance = handler;
    }

    setOnShowNotificationHandler(handler: (text: string) => void) {
        this.onShowNotification = handler;
    }
}

export type FurniInfo = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement, isUpdate: boolean) => void;
export type UserInfo = (id: number, name: string, motto: string, look: string, isMe: boolean, image: HTMLCanvasElement, isUpdate: boolean) => void;

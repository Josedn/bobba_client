import Game from "../Game";
import RequestLogin from "../communication/outgoing/users/RequestLogin";
import User from "../users/User";
import RequestChangeLooks from "../communication/outgoing/rooms/RequestChangeLooks";
import RequestChangeMotto from "../communication/outgoing/rooms/RequestChangeMotto";
import UserItem from "../inventory/UserItem";
import CataloguePage from "../catalogue/CataloguePage";
import { CatalogueIndex } from "../catalogue/Catalogue";
import RoomData from "../navigator/RoomData";
import BobbaEnvironment from "../BobbaEnvironment";
import { MessengerChat } from "../messenger/Messenger";

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
    //Navigator
    onOpenNavigator: () => void;
    onCloseNavigator: () => void;
    onLoadRoomList: (rooms: RoomData[]) => void;
    onOpenCreateRoom: () => void;
    onCloseCreateRoom: () => void;
    //Room Info
    onCurrentRoomDataLoad: (data: RoomData) => void;
    onCloseRoomInfo: () => void;
    //Messenger
    onOpenMessenger: () => void;
    onCloseMessenger: () => void;
    onCloseChat: () => void;
    onSetFriends: (online: User[], offline: User[]) => void;
    onSetFriendsSearch: (users: User[]) => void;
    onSetFriendRequests: (users: User[]) => void;
    onReceiveMessengerMessage: (chat: MessengerChat) => boolean;
    onOpenMessengerChat: (chat: MessengerChat) => void;
    onOpenChat: () => void;
    onShowMessengerAlert: () => void;

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
        this.onOpenNavigator = () => { };
        this.onCloseNavigator = () => { };
        this.onLoadRoomList = () => { };
        this.onCurrentRoomDataLoad = () => { };
        this.onOpenCreateRoom = () => { };
        this.onCloseCreateRoom = () => { };
        this.onOpenMessenger = () => { };
        this.onCloseMessenger = () => { };
        this.onCloseChat = () => { };
        this.onSetFriends = () => { };
        this.onSetFriendsSearch = () => { };
        this.onSetFriendRequests = () => { };
        this.onReceiveMessengerMessage = () => false;
        this.onOpenChat = () => { };
        this.onOpenMessengerChat = () => { };
        this.onShowMessengerAlert = () => { };
        this.onCloseRoomInfo = () => { };
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

    doOpenCreateRoom() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onOpenCreateRoom();
        }
    }

    doCloseCreateRoom() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onCloseCreateRoom();
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

    doOpenNavigator() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.onOpenNavigator();
        }
    }

    doRequestNavigatorSearch(search: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestSearchRooms(search);
        }
    }

    doRequestNavigatorRooms() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestPopularRooms();
        }
    }

    doRequestNavigatorMyRooms() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestOwnRooms();
        }
    }

    doRequestGoToRoom(roomId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestGoToRoom(roomId);
        }
    }

    doRequestLeaveRoom() {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestLeaveRoom();
        }
    }

    doRequestCreateRoom(name: string, selectedModel: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            this.game.navigator.requestCreateRoom(name, selectedModel);
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

    doRequestOpenChat() {
        this.onOpenChat();
    }

    doRequestOpenMessenger(user?: User) {
        this.onOpenMessenger();
    }

    doRequestAskForFriend(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.requestAddFriend(userId);
        }
    }

    doRequestDenyFriendRequest(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.denyFriendRequest(userId);
        }
    }
    doRequestAcceptFriendRequest(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.acceptFriendRequest(userId);
        }
    }
    doRequestFriendSearch(search: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.requestFriendSearch(search);
        }
    }
    doRequestRemoveFriend(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.requestRemoveFriend(userId);
        }
    }
    doRequestFollowFriend(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.requestFollowFriend(userId);
        }
    }
    doRequestStartChat(userId: number) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.requestStartChat(userId);
        }
    }

    doRequestSendChatMessage(userId: number, text: string) {
        const { currentUser } = this.game.userManager;
        if (currentUser != null) {
            BobbaEnvironment.getGame().messenger.sendChatMessage(userId, text);
        }
    }
}

export type FurniInfo = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement, isUpdate: boolean, canMove: boolean, canRotate: boolean, canPickUp: boolean, canUse: boolean) => void;
export type UserInfo = (id: number, name: string, motto: string, look: string, isMe: boolean, image: HTMLCanvasElement, isUpdate: boolean) => void;

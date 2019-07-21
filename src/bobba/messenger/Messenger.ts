import User from "../users/User";
import BobbaEnvironment from "../BobbaEnvironment";
import RequestMessengerSendMessage from "../communication/outgoing/messenger/RequestMessengerSendMessage";
import RequestMessengerFollowFriend from "../communication/outgoing/messenger/RequestMessengerFollowFriend";
import RequestMessengerRemoveFriend from "../communication/outgoing/messenger/RequestMessengerRemoveFriend";
import RequestMessengerAcceptFriend from "../communication/outgoing/messenger/RequestMessengerAcceptFriend";
import RequestMessengerDenyFriend from "../communication/outgoing/messenger/RequestMessengerDenyFriend";
import RequestMessengerSearchFriend from "../communication/outgoing/messenger/RequestMessengerFriendSearch";
import RequestMessengerAddFriend from "../communication/outgoing/messenger/RequestMessengerAddFriend";

export enum MessengerMessageType {
    Me, Friend, Info
}

export type MessengerMessage = {
    text: string,
    type: MessengerMessageType,
};

export type MessengerChat = {
    user: User,
    chats: MessengerMessage[]
}

export default class Messenger {
    activeChats: { [id: number]: MessengerChat };

    constructor() {
        this.activeChats = {};
    }

    requestStartChat(userId: number) {
        const user = BobbaEnvironment.getGame().userManager.getUser(userId);
        if (user != null) {
            this._tryInitializeChat(user);
            BobbaEnvironment.getGame().uiManager.onOpenMessengerChat(this.activeChats[userId]);
        }
    }

    getActiveChat(userId: number): MessengerChat | null {
        const user = BobbaEnvironment.getGame().userManager.getUser(userId);
        if (user != null) {
            this._tryInitializeChat(user);
            return this.activeChats[userId];
        }
        return null;
    }

    handleFriends(online: User[], offline: User[]) {
        BobbaEnvironment.getGame().uiManager.onSetFriends(online, offline);
    }

    handleFriendsSearch(user: User[]) {

    }

    handleFriendRequests(user: User[]) {

    }

    _tryInitializeChat(user: User) {
        if (this.activeChats[user.id] == null) {
            this.activeChats[user.id] = {
                user,
                chats: [],
            };
        }
    }

    handleMessengerMessage(userId: number, text: string, isFromMe: boolean) {
        const user = BobbaEnvironment.getGame().userManager.getUser(userId);
        if (user != null) {
            this._tryInitializeChat(user);

            const message: MessengerMessage = {
                text,
                type: isFromMe ? MessengerMessageType.Me : MessengerMessageType.Friend,
            };

            this.activeChats[userId].chats.push(message);

            const isActive = BobbaEnvironment.getGame().uiManager.onReceiveMessengerMessage(this.activeChats[userId]);
            if (!isActive) {
                BobbaEnvironment.getGame().soundManager.playConsoleReceiveSound();
                BobbaEnvironment.getGame().uiManager.onShowMessengerAlert();
            }
        }
    }

    sendChatMessage(userId: number, text: string) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerSendMessage(userId, text));
    }

    requestFollowFriend(userId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerFollowFriend(userId));
    }

    requestAddFriend(userId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerAddFriend(userId));
    }

    requestRemoveFriend(userId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerRemoveFriend(userId));
    }

    requestFriendSearch(search: string) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerSearchFriend(search));
    }

    acceptFriendRequest(userId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerAcceptFriend(userId));
    }

    denyFriendRequest(userId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestMessengerDenyFriend(userId));
    }
}
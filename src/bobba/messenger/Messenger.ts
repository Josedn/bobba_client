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
    onlineFriends: User[];
    offlineFriends: User[];

    constructor() {
        this.activeChats = {};
        this.onlineFriends = [];
        this.offlineFriends = [];
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
        this.onlineFriends = online;
        this.offlineFriends = offline;
        this.notifyUiFriendsUpdate();
    }

    handleFriendsSearch(user: User[]) {

    }

    handleFriendRequests(user: User[]) {

    }

    notifyUiFriendsUpdate() {
        BobbaEnvironment.getGame().uiManager.onSetFriends(this.onlineFriends, this.offlineFriends);
    }

    handleUpdateFriend(user: User, isOnline: boolean) {
        this.offlineFriends = this.offlineFriends.filter(value => value.id !== user.id);
        this.onlineFriends = this.onlineFriends.filter(value => value.id !== user.id);

        if (isOnline) {
            this.onlineFriends.push(user);
        } else {
            this.offlineFriends.push(user);
        }

        this.notifyUiFriendsUpdate();
        const activeChat = this.activeChats[user.id]
        if (activeChat != null) {
            if (isOnline) {
                this.handleMessengerMessage(user.id, "Your friend went online.", MessengerMessageType.Info);
            } else {
                this.handleMessengerMessage(user.id, "Your friend went offline.", MessengerMessageType.Info);
            }
        }
    }

    _tryInitializeChat(user: User) {
        if (this.activeChats[user.id] == null) {
            this.activeChats[user.id] = {
                user,
                chats: [],
            };
        }
    }

    getCurrentTime(): string {
        const dateWithouthSecond = new Date();
        return dateWithouthSecond.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    handleMessengerMessage(userId: number, text: string, type: MessengerMessageType) {
        const user = BobbaEnvironment.getGame().userManager.getUser(userId);
        if (user != null) {
            this._tryInitializeChat(user);

            if (type !== MessengerMessageType.Info) {
                text = this.getCurrentTime() + ": " + text;
            }

            const message: MessengerMessage = {
                text,
                type
            };

            this.activeChats[userId].chats.push(message);

            const isActive = BobbaEnvironment.getGame().uiManager.onReceiveMessengerMessage(this.activeChats[userId]);
            if (!isActive && type === MessengerMessageType.Friend) {
                BobbaEnvironment.getGame().soundManager.playConsoleReceiveSound();
                BobbaEnvironment.getGame().uiManager.onShowMessengerAlert();
            }
        }
    }

    sendChatMessage(userId: number, text: string) {
        const activeChat = this.activeChats[userId];
        if (activeChat != null) {
            if (activeChat.chats.length === 0) {
                BobbaEnvironment.getGame().soundManager.playConsoleSentSound();
            }
        }
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
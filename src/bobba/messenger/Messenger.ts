import User from "../users/User";
import BobbaEnvironment from "../BobbaEnvironment";
import RequestMessengerSendMessage from "../communication/outgoing/messenger/RequestMessengerSendMessage";
import RequestMessengerFollowFriend from "../communication/outgoing/messenger/RequestMessengerFollowFriend";
import RequestMessengerRemoveFriend from "../communication/outgoing/messenger/RequestMessengerRemoveFriend";
import RequestMessengerAcceptFriend from "../communication/outgoing/messenger/RequestMessengerAcceptFriend";
import RequestMessengerDenyFriend from "../communication/outgoing/messenger/RequestMessengerDenyFriend";
import RequestMessengerSearchFriend from "../communication/outgoing/messenger/RequestMessengerFriendSearch";
import RequestMessengerAddFriend from "../communication/outgoing/messenger/RequestMessengerAddFriend";

export default class Messenger {
    onlineFriends: User[];

    constructor() {
        this.onlineFriends = [];
    }

    requestStartChat(userId: number) {
        const user = BobbaEnvironment.getGame().userManager.getUser(userId);
        if (user != null) {
            BobbaEnvironment.getGame().uiManager.onOpenChat(user);
        }
    }

    handleFriends(online: User[], offline: User[]) {
        BobbaEnvironment.getGame().uiManager.onSetFriends(online, offline);
    }

    handleFriendsSearch(user: User[]) {

    }

    handleFriendRequests(user: User[]) {

    }

    handleMessengerMessage(userId: number, text: string, isFromMe: boolean) {

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
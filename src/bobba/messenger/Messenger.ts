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
    friends: User[];

    constructor() {
        this.friends = [];
    }

    requestStartChat(userId: number) {
        throw new Error("Method not implemented.");
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
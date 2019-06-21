export default class ChatManager {
    chats: Chat[];
    room: Room;

    constructor(room: Room) {
        this.chats = [];
        this.room = room;
    }

    addChat(userId: number, message: string) {
        
    }
}
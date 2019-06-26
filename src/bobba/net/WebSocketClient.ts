import IMessageHandler from "./IMessageHandler";

export default class WebSocketClient {
    connected: boolean;
    ws?: WebSocket;
    messageHandler: IMessageHandler;
    constructor(messageHandler: IMessageHandler) {
        this.connected = false;
        this.messageHandler = messageHandler;
    }

    send(data: string) {
        if (this.connected && this.ws != null) {
            this.ws.send(data);
        }
    }

    connect(connectionURL: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(connectionURL);

            this.ws.onopen = evt => {
                this.connected = true;
                this.messageHandler.handleOpenConnection();
                resolve();
            };

            this.ws.onclose = evt => {
                this.connected = false;
                this.messageHandler.handleCloseConnection();
            };

            this.ws.onmessage = evt => {
                this.messageHandler.handleMessage(evt.data);
            };

            this.ws.onerror = evt => {
                if (!this.connected) {
                    reject('Cannot connect to host');
                }
                this.connected = false;
                this.messageHandler.handleConnectionError();
            };
        });
    }
}
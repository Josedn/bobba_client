import IMessageHandler from "./IMessageHandler";

export default class WebSocketClient {
    connected: boolean;
    ws: WebSocket;
    constructor(messageHandler: IMessageHandler) {
        this.ws = new WebSocket('ws://localhost:443');
        this.connected = false;

        this.ws.onopen = () => {
            this.connected = true;
            messageHandler.handleOpenConnection();
        };

        this.ws.onclose = () => {
            this.connected = false;
            messageHandler.handleCloseConnection();
        };

        this.ws.onerror = () => {
            this.connected = false;
            messageHandler.handleConnectionError();
        };

        this.ws.onmessage = evt => {
            messageHandler.handleMessage(evt.data);
        };
    }
}
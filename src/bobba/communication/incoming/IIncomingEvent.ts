import ServerMessage from "../protocol/ServerMessage";

export default interface IIncomingEvent {
    handle(request: ServerMessage): void,
}
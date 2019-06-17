export default interface IMessageHandler {
    handleMessage(message: string): void,
    handleOpenConnection(): void,
    handleCloseConnection(): void,
    handleConnectionError(): void,
}
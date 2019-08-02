import React, { ChangeEvent, ReactNode, RefObject } from 'react';
import WindowManager from "../windows/WindowManager";
import Draggable from 'react-draggable';
import './chat.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import User from '../../bobba/users/User';
import { MessengerMessage, MessengerMessageType, MessengerChat } from '../../bobba/messenger/Messenger';

type ChatProps = {};
type ChatState = {
    visible: boolean,
    zIndex: number,
    text: string,
    messages: MessengerMessage[],
    notifications: number[]
    currentActiveChatId: number,
    currentTabOffset: number,
    activeChats: User[]
};
const initialState: ChatState = {
    visible: false,
    zIndex: WindowManager.getNextZIndex(),
    text: '',
    messages: [],
    currentActiveChatId: 0,
    currentTabOffset: 0,
    activeChats: [],
    notifications: [],
};

export default class Chat extends React.Component<ChatProps, ChatState> {
    chatWrapper: RefObject<HTMLDivElement>;
    constructor(props: ChatProps) {
        super(props);
        this.state = initialState;
        this.chatWrapper = React.createRef();
    }

    scrollDown() {
        if (this.chatWrapper.current != null) {
            (window as any).wrapper = this.chatWrapper.current;
            this.chatWrapper.current.scrollTop = this.chatWrapper.current.scrollHeight - this.chatWrapper.current.clientHeight;
        }
    }

    componentDidMount() {
        const { uiManager } = BobbaEnvironment.getGame();
        uiManager.onOpenChat = (() => {
            const { activeChats } = this.state;
            this.setState({
                visible: activeChats.length > 0,
                zIndex: WindowManager.getNextZIndex(),
            });
        });

        uiManager.onCloseChat = (() => {
            this.setState({
                visible: false,
            })
        });

        uiManager.onOpenMessengerChat = ((chat: MessengerChat) => {
            const { activeChats } = this.state;
            if (activeChats.find(user => user.id === chat.user.id)) {
                this.setState({
                    visible: true,
                    zIndex: WindowManager.getNextZIndex(),
                    messages: chat.chats,
                    currentActiveChatId: chat.user.id,
                });
            } else {
                this.setState({
                    visible: true,
                    zIndex: WindowManager.getNextZIndex(),
                    activeChats: [...activeChats, chat.user],
                    messages: chat.chats,
                    currentActiveChatId: chat.user.id,
                });
            }
            this.scrollDown();
        });

        uiManager.onReceiveMessengerMessage = ((chat: MessengerChat) => {
            const { currentActiveChatId, notifications, activeChats, visible } = this.state;
            if (activeChats.find(value => value.id === chat.user.id)) {
                if (currentActiveChatId === chat.user.id) {
                    this.setState({
                        messages: chat.chats,
                    });
                    this.scrollDown();
                    return visible;
                } else {
                    this.setState({
                        notifications: [...notifications, chat.user.id],
                    });
                }
            } else if (activeChats.length === 0) {
                this.setState({
                    activeChats: [...activeChats, chat.user],
                    messages: chat.chats,
                    currentActiveChatId: chat.user.id,
                });
                this.scrollDown();
            } else {
                this.setState({
                    activeChats: [...activeChats, chat.user],
                    notifications: [...notifications, chat.user.id],
                });
            }
            return false;
        });
    }

    close = () => {
        this.setState({
            visible: false,
        });
    }

    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }

    //TypeScript or React bug: KeyboardEvent is not a generic type
    handleKeyDown = (evt: any) => {
        const event = evt as KeyboardEvent;
        const isEnter = event.which === 13;
        const { currentActiveChatId, text } = this.state;
        if (isEnter) {
            event.preventDefault();
            if (text.length > 0) {
                BobbaEnvironment.getGame().uiManager.doRequestSendChatMessage(currentActiveChatId, text);
            }

            this.setState({
                text: '',
            });
        }
    }

    handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            text: event.target.value,
        });
    }

    requestFollowFriend = () => {
        const { currentActiveChatId } = this.state;
        BobbaEnvironment.getGame().uiManager.doRequestFollowFriend(currentActiveChatId);
    }

    requestCloseChat = () => {
        const { activeChats, currentActiveChatId } = this.state;
        const newChats = activeChats.filter(value => {
            return value.id !== currentActiveChatId;
        });
        if (newChats.length === 0) {
            this.setState({
                activeChats: newChats,
                currentActiveChatId: 0,
                visible: false,
            });
        } else {
            this.setState({
                activeChats: newChats,
            });
            BobbaEnvironment.getGame().uiManager.doRequestStartChat(newChats[0].id);
        }
    }

    handleTabChange = (userId: number) => () => {
        const { notifications } = this.state;
        if (notifications.includes(userId)) {
            this.setState({
                notifications: notifications.filter(friend => friend !== userId),
            });
        }
        BobbaEnvironment.getGame().uiManager.doRequestStartChat(userId);
    }

    generateFriendTab(friend: User) {
        const { currentActiveChatId, notifications } = this.state;
        let className = friend.id === currentActiveChatId ? 'selected' : '';
        if (notifications.includes(friend.id)) {
            className = 'alert';
        }
        return (
            <button onClick={this.handleTabChange(friend.id)} key={friend.id} className={className}>
                <img src={"https://www.habbo.com/habbo-imaging/avatarimage?figure=" + friend.look + "&direction=2&head_direction=2&size=s&headonly=1"} alt={friend.name} />
            </button>
        );
    }

    handleOffsetChange = (increment: number) => () => {
        const { currentTabOffset } = this.state;
        this.setState({
            currentTabOffset: currentTabOffset + increment
        });
    }

    generateLeftArrow(): ReactNode {
        const { currentTabOffset } = this.state;
        if (currentTabOffset !== 0) {
            return (
                <button onClick={this.handleOffsetChange(currentTabOffset === 2 ? -2 : -1)} className="arrow">
                    <img src="/images/messenger/prev.png" alt="" />
                </button>
            );
        }
        return <></>;
    }

    generateRightArrow(): ReactNode {
        const { activeChats, currentTabOffset } = this.state;
        if (activeChats.length - currentTabOffset !== 6) {
            return (
                <button onClick={this.handleOffsetChange(currentTabOffset === 0 ? 2 : 1)} className="arrow">
                    <img src="/images/messenger/next.png" alt="" />
                </button>
            );
        }
        return <></>;
    }

    generateMainTabs(): ReactNode {
        const { activeChats, currentTabOffset } = this.state;

        if (activeChats.length > 7) {
            const friends: ReactNode[] = [];
            let friendsToShow = 7;
            if (currentTabOffset === 0) {
                friendsToShow--;
            }
            if (activeChats.length - currentTabOffset === 6) {
                friendsToShow--;
            } else if (currentTabOffset > 0) {
                friendsToShow -= 2;
            }
            for (let i = 0; i < friendsToShow; i++) {
                friends.push(this.generateFriendTab(activeChats[i + Math.max(0, currentTabOffset)]));
            }
            return (
                <>
                    {this.generateLeftArrow()}
                    {friends}
                    {this.generateRightArrow()}
                </>
            );
        }

        return activeChats.map(friend => this.generateFriendTab(friend));
    }

    generateChats(): ReactNode {
        const { messages } = this.state;
        let key = 0;
        return messages.map(chat => {
            let className = '';
            if (chat.type === MessengerMessageType.Me) {
                className = 'me';
            }
            if (chat.type === MessengerMessageType.Info) {
                className = 'info';
            }
            return (
                <p key={key++} className={className}>
                    {chat.text}
                </p>
            );
        });
    }

    render() {
        const { visible, zIndex, text, activeChats, currentActiveChatId } = this.state;
        if (!visible || activeChats.length === 0) {
            return <></>;
        }

        let title = "Chat";
        const activeFriend = activeChats.find(friend => friend.id === currentActiveChatId);
        if (activeFriend !== undefined) {
            title = activeFriend.name;
        }

        return (
            <Draggable defaultClassName="chat" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
                    <h2 className="title">
                        {title}
                    </h2>
                    <div className="main_tab_container">
                        {this.generateMainTabs()}
                    </div>
                    <div className="actions_container">
                        <button onClick={this.requestFollowFriend}>
                            <img src="/images/messenger/follow_friend.png" alt="Follow friend" />
                        </button>
                        <button onClick={this.requestCloseChat} className="close_chat">
                            <img src="/images/messenger/close.png" alt="Close" />
                        </button>
                    </div>
                    <div className="wrapper" ref={this.chatWrapper}>
                        {this.generateChats()}
                    </div>

                    <form>
                        <textarea value={text} onKeyDown={this.handleKeyDown} onChange={this.handleChange} rows={2} cols={10}></textarea>
                    </form>
                </div>
            </Draggable>
        );
    }
}
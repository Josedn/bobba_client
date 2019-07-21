import React, { ChangeEvent, ReactNode } from 'react';
import WindowManager from "../windows/WindowManager";
import Draggable from 'react-draggable';
import './chat.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import User from '../../bobba/users/User';

enum MessengerMessageType {
    Me, Friend, Info
}

type MessengerMessage = {
    text: string,
    type: MessengerMessageType,
};

type ChatProps = {};
type ChatState = {
    visible: boolean,
    zIndex: number,
    text: string,
    messages: MessengerMessage[],
    currentActiveChatId: number,
    currentTabOffset: number,
    activeChats: User[]
};
let tempId = 0;
const initialState: ChatState = {
    visible: true,
    zIndex: WindowManager.getNextZIndex(),
    text: '',
    messages: [],
    currentActiveChatId: 0,
    currentTabOffset: 0,
    activeChats: [{
        id: tempId++,
        look: 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45',
        name: 'Relevance' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45',
        name: 'Gravity' + tempId,
        motto: ''
    },
    {
        id: tempId++,
        look: 'ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10',
        name: 'Gravity' + tempId,
        motto: ''
    }],
};

export default class Chat extends React.Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const { uiManager } = BobbaEnvironment.getGame();
        uiManager.setOnOpenChatHandler(user => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex(),
            })
        });

        uiManager.setOnCloseChatHandler(() => {
            this.setState({
                visible: false,
            })
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
        if (isEnter) {
            event.preventDefault();
            const { currentActiveChatId, text } = this.state;
            BobbaEnvironment.getGame().uiManager.doRequestSendChatMessage(currentActiveChatId, text);

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
        //BobbaEnvironment.getGame().uiManager.doRequestFollowFriend(userId);
    }

    requestCloseChat = () => {
        //BobbaEnvironment.getGame().uiManager.doRequestFollowFriend(userId);
    }

    handleTabChange = (userId: number) => () => {
        this.setState({
            currentActiveChatId: userId,
        });
    }

    generateFriendTab(friend: User) {
        const { currentActiveChatId } = this.state;
        return (
            <button onClick={this.handleTabChange(friend.id)} key={friend.id} className={friend.id === currentActiveChatId ? 'selected' : ''}>
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
        return (
            <>
                <p className="info">
                    Revelar tu contraseña o datos personales en Internet es peligroso. Por tu seguridad, un moderador podría supervisar tu conversación.
                        </p>
                <p className="me">
                    3:50pm: hello ther, this is a very long chat line. idk what to write more
                        </p>
                <p>
                    3:51pm: lol it actually works
                        </p>
                <p className="info">
                    Tu amig@ se ha desconectado.
                        </p>
            </>
        );
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
                    <div className="wrapper">
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
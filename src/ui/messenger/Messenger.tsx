import React, { ReactNode, FormEvent, ChangeEvent } from 'react';
import WindowManager from "../windows/WindowManager";
import Draggable from 'react-draggable';
import './messenger.css';
import User from '../../bobba/users/User';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';

enum Tabs {
    Friends, Search, Requests, None,
};

type MessengerProps = {};
type MessengerState = {
    visible: boolean,
    zIndex: number,
    search: string,
    currentTab: Tabs,
    firstRowActive: boolean,
    secondRowActive: boolean,
    onlineFriends: User[],
    offlineFriends: User[],
    friendsRequests: User[],
    searchResult: User[],
    currentSelectedFriendId: number,
};
const initialState: MessengerState = {
    visible: true,
    zIndex: WindowManager.getNextZIndex(),
    search: '',
    currentTab: Tabs.Friends,
    firstRowActive: true,
    secondRowActive: true,
    currentSelectedFriendId: -1,
    onlineFriends: [],
    offlineFriends: [],
    friendsRequests: [],
    searchResult: [],
};

export default class Messenger extends React.Component<MessengerProps, MessengerState> {
    constructor(props: MessengerProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const { uiManager } = BobbaEnvironment.getGame();
        uiManager.onOpenMessenger = (() => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex(),
            })
        });

        uiManager.onCloseMessenger = (() => {
            this.setState({
                visible: false,
            })
        });

        uiManager.onSetFriends = ((onlineFriends, offlineFriends) => {
            this.setState({
                onlineFriends,
                offlineFriends
            });
        });

        uiManager.onSetFriendRequests = (friendsRequests => {
            this.setState({
                friendsRequests
            });
        });

        uiManager.onSetFriendsSearch = (searchResult => {
            this.setState({
                searchResult
            });
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

    requestStartChat = (userId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestStartChat(userId);
    }

    requestFollowFriend = (userId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestFollowFriend(userId);
    }

    requestAddFriend = (userId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestAskForFriend(userId);
    }

    requestRemoveFriend = (userId: number) => () => {
        if (userId !== -1) {
            BobbaEnvironment.getGame().uiManager.doRequestRemoveFriend(userId);
        }
    }

    requestSearch = (search: string) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestFriendSearch(search);
    }

    requestAcceptFriendRequest = (userId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestAcceptFriendRequest(userId);
    }

    requestDenyFriendRequest = (userId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestDenyFriendRequest(userId);
    }

    requestAcceptAllFriendRequests = () => {
        const { friendsRequests } = this.state;
        friendsRequests.forEach(request => {
            this.requestAcceptFriendRequest(request.id)();
        });
    }

    requestDenyAllFriendRequests = () => {
        const { friendsRequests } = this.state;
        friendsRequests.forEach(request => {
            this.requestDenyFriendRequest(request.id)();
        });
    }

    generateRequestsGrid(friends: User[]): ReactNode {
        return friends.map(friend => {
            return (
                <div key={friend.id} className="friend">
                    <img src={"https://www.habbo.com/habbo-imaging/avatarimage?figure=" + friend.look + "&direction=2&head_direction=2&size=s&headonly=1"} alt={friend.name} />
                    <span>{friend.name}</span>
                    <div className="icons_container">
                        <button onClick={this.requestAcceptFriendRequest(friend.id)} className="accept" />
                        <button onClick={this.requestDenyFriendRequest(friend.id)} className="decline" />
                    </div>
                </div>
            );
        });
    }

    generateOnlineFriendsGrid(friends: User[]): ReactNode {
        return friends.map(friend => {
            return (
                <div key={friend.id} className="friend">
                    <img src={"https://www.habbo.com/habbo-imaging/avatarimage?figure=" + friend.look + "&direction=2&head_direction=2&size=s&headonly=1"} alt={friend.name} />
                    <span>{friend.name}</span>
                    <div className="icons_container">
                        <button onClick={this.requestStartChat(friend.id)} className="start_chat" />
                        <button onClick={this.requestFollowFriend(friend.id)} className="follow_friend" />
                    </div>
                </div>
            );
        });
    }

    generateOfflineFriendsGrid(friends: User[]): ReactNode {
        return friends.map(friend => {
            return (
                <div key={friend.id} className="friend">
                    <img src={"https://www.habbo.com/habbo-imaging/avatarimage?figure=" + friend.look + "&direction=2&head_direction=2&size=s&headonly=1"} alt={friend.name} />
                    <span>{friend.name}</span>
                </div>
            );
        });
    }

    generateSearchGrid(friends: User[]): ReactNode {
        return friends.map(friend => {
            return (
                <div key={friend.id} className="friend">
                    <img src={"https://www.habbo.com/habbo-imaging/avatarimage?figure=" + friend.look + "&direction=2&head_direction=2&size=s&headonly=1"} alt={friend.name} />
                    <span>{friend.name}</span>
                    <div className="icons_container">
                        <button onClick={this.requestAddFriend(friend.id)} className="ask_for_friend" />
                    </div>
                </div>
            );
        });
    }

    toggleFirstRow = () => {
        const { firstRowActive } = this.state;
        this.setState({
            firstRowActive: !firstRowActive,
        })
    }

    toggleSecondRow = () => {
        const { secondRowActive } = this.state;
        this.setState({
            secondRowActive: !secondRowActive,
        })
    }

    generateFriendsTab(): React.ReactNode {
        const { currentTab, firstRowActive, secondRowActive, onlineFriends, offlineFriends, currentSelectedFriendId } = this.state;

        if (currentTab === Tabs.Friends) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className="main_tab selected">
                        <span>Friends</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper">
                        <div className="friends_container">
                            <button onClick={this.toggleFirstRow} className="second_tab">
                                Friends ({onlineFriends.length})
                            </button>
                            <div className="friend_list">
                                {firstRowActive ? this.generateOnlineFriendsGrid(onlineFriends) : <></>}
                            </div>
                            <button onClick={this.toggleSecondRow} className="second_tab">
                                Offline friends ({offlineFriends.length})
                            </button>
                            <div className="friend_list">
                                {secondRowActive ? this.generateOfflineFriendsGrid(offlineFriends) : <></>}
                            </div>
                        </div>
                        <div className="actions_container">
                            <button onClick={this.requestRemoveFriend(currentSelectedFriendId)}>
                                <img src="/images/messenger/remove_friend.png" alt="Remove friend" />
                            </button>
                            <button onClick={this.requestStartChat(currentSelectedFriendId)}>
                                <img src="/images/messenger/open_inbox.png" alt="Open inbox" />
                            </button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div onClick={this.handleChangeTab(Tabs.Friends)} className="main_tab selected">
                    <span>Friends</span>
                    <button className="open_arrow" />
                </div>
            );
        }
    }

    generateSearchTab(): React.ReactNode {
        const { currentTab, search, firstRowActive, secondRowActive, onlineFriends, offlineFriends, searchResult } = this.state;
        const filteredFriends = [...onlineFriends, ...offlineFriends].filter(user => {
            return user.name.toLowerCase().includes(search.toLowerCase());
        });

        if (currentTab === Tabs.Search) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className="main_tab">
                        <span>Search</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper search">
                        <div className="friends_container">
                            <button onClick={this.toggleFirstRow} className="second_tab">
                                Friends ({filteredFriends.length})
                            </button>
                            <div className="friend_list">
                                {firstRowActive ? this.generateOfflineFriendsGrid(filteredFriends) : <></>}
                            </div>
                            <button onClick={this.toggleSecondRow} className="second_tab">
                                Other users ({searchResult.length})
                            </button>
                            <div className="friend_list">
                                {secondRowActive ? this.generateSearchGrid(searchResult) : <></>}
                            </div>
                        </div>
                        <div className="actions_container">
                            <form onSubmit={this.handleSearch}>
                                <input autoComplete="off" type="text" onChange={this.handleSearchChange} value={search} name="room_search" placeholder="Search..." />
                                <button>Search</button>
                            </form>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div onClick={this.handleChangeTab(Tabs.Search)} className="main_tab">
                    <span>Search</span>
                    <button className="open_arrow" />
                </div>
            );
        }
    }
    handleChangeTab = (currentTab: Tabs) => () => {
        this.setState({
            currentTab,
        });
    }

    generateRequestsTab(): React.ReactNode {
        const { currentTab, friendsRequests } = this.state;
        const className = "main_tab " + (friendsRequests.length > 0 ? 'active' : '');

        if (currentTab === Tabs.Requests) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className={className}>
                        <span>Friend requests</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper">
                        <div className="friends_container">
                            <div className="friend_list">
                                {this.generateRequestsGrid(friendsRequests)}
                            </div>
                        </div>
                        <div className="actions_container requests">
                            <button onClick={this.requestAcceptAllFriendRequests}>
                                <img src="/images/messenger/accept.png" alt="Remove friend" />
                                <span>Accept all</span>
                            </button>
                            <button onClick={this.requestDenyAllFriendRequests}>
                                <img src="/images/messenger/decline.png" alt="Remove friend" />
                                <span>Deny all</span>
                            </button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.Requests)} className={className}>
                        <span>Friend requests</span>
                        <button className="open_arrow" />
                    </div>
                </>
            );
        }


    }

    generateFooter(): React.ReactNode {
        return (
            <>
                <div className="footer">
                    <button>
                        <img src="/images/messenger/open_edit_ctgs.png" alt="Settings" />
                        <span>Settings</span>
                    </button>
                </div>
            </>
        );
    }

    handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            search: event.target.value,
        });
    }

    handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { search } = this.state;
        BobbaEnvironment.getGame().uiManager.doRequestFriendSearch(search);
    }

    render() {
        const { visible, zIndex } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable defaultClassName="messenger" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
                    <h2 className="title">
                        Friends
                    </h2>
                    {this.generateFriendsTab()}
                    {this.generateSearchTab()}
                    {this.generateRequestsTab()}
                    {this.generateFooter()}
                </div>
            </Draggable>
        );
    }

}
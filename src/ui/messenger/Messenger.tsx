import React, { ReactNode, FormEvent, ChangeEvent } from 'react';
import WindowManager from "../windows/WindowManager";
import Draggable from 'react-draggable';
import './messenger.css';

enum Tabs {
    Friends, Search, Requests, None,
};

type MessengerProps = {};
type MessengerState = {
    visible: boolean,
    zIndex: number,
    search: string,
    currentTab: Tabs,
};
const initialState = {
    visible: true,
    zIndex: WindowManager.getNextZIndex(),
    search: '',
    currentTab: Tabs.Requests,
};

export default class Messenger extends React.Component<MessengerProps, MessengerState> {
    constructor(props: MessengerProps) {
        super(props);
        this.state = initialState;
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

    generateRequestsGrid(): ReactNode {
        return (
            <>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Gravity</span>
                    <div className="icons_container">
                        <button className="accept" />
                        <button className="decline" />
                    </div>
                </div>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=hd-190-10.lg-3023-1408.ch-215-91.hr-893-45&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Relevance</span>
                    <div className="icons_container">
                        <button className="accept" />
                        <button className="decline" />
                    </div>
                </div>
            </>
        );
    }

    generateOnlineFriendsGrid(): ReactNode {
        return (
            <>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Gravity</span>
                    <div className="icons_container">
                        <button className="start_chat" />
                        <button className="follow_friend" />
                    </div>
                </div>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=hd-190-10.lg-3023-1408.ch-215-91.hr-893-45&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Relevance</span>
                    <div className="icons_container">
                        <button className="start_chat" />
                        <button className="follow_friend" />
                    </div>
                </div>
            </>
        );
    }

    generateOfflineFriendsGrid(): ReactNode {
        return (
            <>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Gravity</span>
                </div>
                <div className="friend">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=hd-190-10.lg-3023-1408.ch-215-91.hr-893-45&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                    <span>Relevance</span>
                </div>
            </>
        );
    }

    generateFriendsTab(): React.ReactNode {
        const { currentTab } = this.state;

        if (currentTab === Tabs.Friends) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className="main_tab selected">
                        <span>Amig@s</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper">
                        <div className="friends_container">
                            <button className="second_tab">
                                Amig@s (2)
                                </button>
                            <div className="friend_list">
                                {this.generateOnlineFriendsGrid()}
                            </div>
                            <button className="second_tab">
                                Amig@s desconectad@s (90)
                                </button>
                            <div className="friend_list">
                                {this.generateOfflineFriendsGrid()}
                            </div>
                        </div>
                        <div className="actions_container">
                            <button>
                                <img src="/images/messenger/remove_friend.png" alt="Remove friend" />
                            </button>
                            <button>
                                <img src="/images/messenger/open_inbox.png" alt="Open inbox" />
                            </button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <div onClick={this.handleChangeTab(Tabs.Friends)} className="main_tab selected">
                    <span>Amig@s</span>
                    <button className="open_arrow" />
                </div>
            );
        }
    }

    generateSearchTab(): React.ReactNode {
        const { search, currentTab } = this.state;
        if (currentTab === Tabs.Search) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className="main_tab">
                        <span>Buscar</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper search">
                        <div className="friends_container">
                            <button className="second_tab">
                                Amig@s (2)
                                </button>
                            <div className="friend_list">
                                {this.generateOnlineFriendsGrid()}
                            </div>
                            <button className="second_tab">
                                Otros usuarios (34)
                            </button>
                            <div className="friend_list">
                                {this.generateOfflineFriendsGrid()}
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
                    <span>Buscar</span>
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
        const { currentTab } = this.state;

        if (currentTab === Tabs.Requests) {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.None)} className="main_tab active">
                        <span>Peticiones de amig@s</span>
                        <button className="close_arrow" />
                    </div>
                    <div className="wrapper">
                        <div className="friends_container">
                            <div className="friend_list">
                                {this.generateRequestsGrid()}
                            </div>
                        </div>
                        <div className="actions_container requests">
                            <button>
                                <img src="/images/messenger/accept.png" alt="Remove friend" />
                                <span>Aceptar todos</span>
                            </button>
                            <button>
                                <img src="/images/messenger/decline.png" alt="Remove friend" />
                                <span>Rechazar todos</span>
                            </button>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div onClick={this.handleChangeTab(Tabs.Requests)} className="main_tab active">
                        <span>Peticiones de amig@s</span>
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
                        <span>Ajustes</span>
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
        /*const { search } = this.state;
        this.setState({
            mainTabId: 'search',
            currentRooms: undefined,
        });
        BobbaEnvironment.getGame().uiManager.doRequestNavigatorSearch(search);*/
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
                        Amig@s
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
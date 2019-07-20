import React from 'react';
import WindowManager from "../windows/WindowManager";
import Draggable from 'react-draggable';
import './messenger.css';

type MessengerProps = {};
type MessengerState = {
    visible: boolean,
    zIndex: number,
};
const initialState = {
    visible: true,
    zIndex: WindowManager.getNextZIndex(),
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
                    <hr />
                    <div className="main_tab selected">
                        <span>Amig@s</span>
                        <button className="open_arrow" />
                    </div>
                    <div className="wrapper">
                        <div className="friends_container">
                            <button className="second_tab">
                                Amig@s (2)
                        </button>
                            <div className="friend_list">
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
                            </div>
                            <button className="second_tab">
                                Amig@s desconectad@s (90)
                        </button>
                            <div className="friend_list">
                                <div className="friend">
                                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                                    <span>Gravity</span>
                                    <div className="icons_container">
                                        <button className="start_chat" />
                                    </div>
                                </div>
                                <div className="friend">
                                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=hd-190-10.lg-3023-1408.ch-215-91.hr-893-45&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                                    <span>Relevance</span>
                                    <div className="icons_container">
                                        <button className="start_chat" />
                                    </div>
                                </div>
                                <div className="friend">
                                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?figure=hd-190-10.lg-3023-1408.ch-215-91.hr-893-45&direction=2&head_direction=2&size=s&headonly=1" alt="" />
                                    <span>Relevance</span>
                                    <div className="icons_container">
                                        <button className="start_chat" />
                                    </div>
                                </div>
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

                    <div className="main_tab">
                        <span>Buscar</span>
                        <button className="close_arrow" />
                    </div>

                    <div className="footer">
                        <button>
                            <img src="/images/messenger/open_edit_ctgs.png" alt="Settings" />
                            <span>Ajustes</span>
                        </button>
                    </div>
                </div>
            </Draggable>
        );
    }

}
import React, { Component } from 'react';
import Draggable from 'react-draggable';
import './roominfo.css';
import RoomData, { LockType } from '../../bobba/navigator/RoomData';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';

type RoomInfoProps = {};
type RoomInfoState = {
    visible: boolean,
    roomData: RoomData,
};
const initialState = {
    visible: true,
    roomData: new RoomData(1, "The deep forest", "Relevance", "Cool room", 0, 0, false, LockType.Open),
};

class RoomInfo extends Component<RoomInfoProps, RoomInfoState> {

    constructor(props: RoomInfoProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.onCurrentRoomDataLoad = (roomData => {
            this.setState({
                roomData,
                visible: true,
            })
        });

        BobbaEnvironment.getGame().uiManager.onCloseRoomInfo = () => {
            this.setState({
                visible: false,
            })
        };
    }

    render() {
        const { visible, roomData } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable>
                <div className="room_info">
                    <h2 className="title">{roomData.name}</h2>
                    <p className="owner_info">Owner: <span className="owner_name">{roomData.owner}</span></p>
                    <div className="buttons_container">
                        <button>
                            <img src="images/room_info/clear_favourite.png" alt="Favorite" />
                        </button>
                        <button>
                            <img src="images/room_info/settings_icon.png" alt="Settings" />
                        </button>
                        <button>
                            <img src="images/room_info/chat_history.png" alt="Chat history" />
                        </button>
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default RoomInfo;
import React, { Component } from 'react';
import Draggable from 'react-draggable';
import './roominfo.css';

class RoomInfo extends Component {

    render() {
        return (
            <Draggable>
                <div className="room_info">
                    <h2 className="title">The deep forest</h2>
                    <p className="owner_info">Owner: <span className="owner_name">Relevance</span></p>
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
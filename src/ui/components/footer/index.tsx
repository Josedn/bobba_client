import React, { Component, SyntheticEvent } from 'react';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
const initialState = {
    chat: '',
};
class Footer extends Component {

    constructor(props: object) {
        super(props);
        this.state = initialState;
    }

    handleSubmit = (event: SyntheticEvent) => {
        const { chat } = this.state as any;
        event.preventDefault();

        const room = BobbaEnvironment.getGame().currentRoom;

        if (room != null) {
            room.chat(chat);
        }

        this.setState(initialState);
    }

    handleInputChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { chat } = this.state as any;
        return (
            <footer>
                <div className="footer_container">
                    <div className="left_section">
                        <button>
                            <img src="images/bottom_bar/logo.png" alt="Return" />
                        </button>
                        <button>
                            <img src="images/bottom_bar/rooms.png" alt="Rooms" />
                        </button>
                        <button>
                            <img src="images/bottom_bar/shop.png" alt="Shop" />
                        </button>
                    </div>
                    <div className="middle_section">
                        <button>
                            <img src="images/bottom_bar/ghosthead.png" alt="Me" />
                        </button>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="chat" value={chat} placeholder="Click here to chat" onChange={this.handleInputChange} />
                            <button>
                                <img src="images/bottom_bar/chat_styles.png" alt="Chat styles" />
                            </button>
                        </form>

                    </div>
                    <div className="right_section">
                        <button>
                            <img src="images/bottom_bar/all_friends.png" alt="Friends" />
                        </button>
                        <button>
                            <img src="images/bottom_bar/messenger.png" alt="Messenger" />
                        </button>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;

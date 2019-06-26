import React, { Component, SyntheticEvent, RefObject } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';

const MAX_CHAT_LENGTH = 95;
const initialState = {
    chat: '',
};
type FooterProps = {};
type FooterState = {
    chat: string,
};
class Footer extends Component<FooterProps, FooterState> {

    chatInput: RefObject<HTMLInputElement>;
    constructor(props: FooterProps) {
        super(props);
        this.state = initialState;
        this.chatInput = React.createRef();
    }

    focusChatInput = (event: Event) => {
        if (this.chatInput.current != null) {
            this.chatInput.current.focus();
        }
    }

    handleSubmit = (event: SyntheticEvent) => {
        const { chat } = this.state;
        event.preventDefault();

        if (chat.length > 0 && chat.length <= MAX_CHAT_LENGTH) {
            BobbaEnvironment.getGame().uiManager.doChat(chat);
        }

        this.setState(initialState);
    }

    handleInputChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        } as FooterState);
    }

    render() {
        const { chat } = this.state;
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
                        <button>
                            <img src="images/bottom_bar/inventory.png" alt="Me" />
                        </button>
                    </div>
                    <div className="middle_section">
                        <button>
                            <img src="images/bottom_bar/ghosthead.png" alt="Me" />
                        </button>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" ref={this.chatInput} maxLength={MAX_CHAT_LENGTH} name="chat" value={chat} autoComplete="off" placeholder="Click here to chat" onChange={this.handleInputChange} />
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

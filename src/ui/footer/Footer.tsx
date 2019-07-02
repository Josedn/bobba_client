import React, { Component, SyntheticEvent, RefObject } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import './footer.css';

const MAX_CHAT_LENGTH = 95;
const initialState = {
    chat: '',
};
type FooterProps = {
    headImage?: HTMLImageElement,
    focuser: (handler: () => void) => void;
};
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

    componentDidMount() {
        this.props.focuser(this.focusChatInput);
    }

    focusChatInput = () => {
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
        const value = target.value;
        this.setState({
            chat: value,
        });
    }

    changeLooks = () => {
        BobbaEnvironment.getGame().uiManager.doOpenChangeLooks();
    }

    openInventory = () => {
        BobbaEnvironment.getGame().uiManager.doOpenInventory();
    }

    render() {
        const { chat } = this.state;
        const { headImage } = this.props;

        let userface = (
            <button>
                <img src="images/bottom_bar/ghosthead.png" alt="Me" />
            </button>
        );
        if (headImage !== undefined) {
            userface = (
                <button className="user_face" onClick={this.changeLooks}>
                    <img src={headImage.src} alt="Me" />
                </button>
            );
        }
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
                        <button onClick={this.openInventory}>
                            <img src="images/bottom_bar/inventory.png" alt="Me" />
                        </button>
                    </div>
                    <div className="middle_section">
                        {userface}
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

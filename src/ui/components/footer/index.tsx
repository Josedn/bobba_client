import React, { Component } from 'react';

class Footer extends Component {

    render() {
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
                        <input type="text" placeholder="Click here to chat" />
                        <button>
                            <img src="images/bottom_bar/chat_styles.png" alt="Chat styles" />
                        </button>
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

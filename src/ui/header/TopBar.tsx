import React, { Component } from 'react';

class TopBar extends Component {

    render() {
        return (
            <div className="top_bar">
                <button className="bar_content">
                    <img src="images/top_bar/settings.png" alt="Settings" />
                </button>
                <button className="bar_content">
                    <img src="images/top_bar/logout.png" alt="Logout" />
                </button>
            </div>
        );
    }
}

export default TopBar;

import React, { Component } from 'react';
import './header.css';

class Header extends Component {

    render() {
        return (
            <header>
                <div className="bar_content">
                    <span>420</span>
                    <img src="images/top_bar/credits.png" alt="Credits" />
                </div>
                <div className="bar_content">
                    <span className="logo">bobba.io</span>
                </div>
                <div className="bar_content">
                    <span>69</span>
                    <img src="images/top_bar/hc.png" alt="Habbo club" />
                </div>
            </header>
        );
    }
}

export default Header;

import React, { Component } from 'react';
import './header.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
type HeaderProps = {};
type HeaderState = {
    credits: number,
};

const initialState = {
    credits: 0,
};
class Header extends Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.setOnUpdateCreditsBalanceHandler((amount: number) => {
            this.setState({
              credits: amount,  
            })
        });
    }

    render() {
        const { credits } = this.state;
        return (
            <header>
                <div className="bar_content">
                    <span>{credits}</span>
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

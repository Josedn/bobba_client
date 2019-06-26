import React, { Component } from 'react';
import Logo from './Logo';
import Credits from './Credits';

class GenericSplash extends Component {

    render() {
        return (
            <div className="main_wrapper">
                <div className="main_container">
                    <div className="main_content">
                        <button className="close">
                            X
                        </button>
                        <Logo />
                        <hr />
                        {this.props.children}
                    </div>
                    <Credits />
                </div>
            </div>
        );
    }
}

export default GenericSplash;

import React, { Component } from 'react';
import Logo from './Logo';
import JoinForm from './JoinForm';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import { connect } from 'react-redux';
import { loadGame } from '../../actions';

class MainContent extends Component {

    componentDidMount() {
        const game = BobbaEnvironment.getGame();
        const { dispatch } = this.props as any;

        if (!game.isStarting) {
            game.loadGame().then(() => {
                dispatch(loadGame());
            }).catch(() => {

            });
        }
    }

    render() {
        const { gameLoaded, loggedIn } = (this.props as any).loginContext;

        if (!loggedIn) {
            let form = (
                <div className="loading">
                    <img src="images/loading.gif" alt="Loading" />
                    <p>Loading...</p>
                </div>
            );
            if (gameLoaded) {
                form = (
                    <>
                        <p>
                            Please enter your username and pick a look!
                        </p>
                        <JoinForm />
                    </>);
            }
            return (
                <div className="main_wrapper">
                    <div className="main_container">
                        <div className="main_content">
                            <button className="close">
                                X
                            </button>
                            <Logo />
                            <hr />
                            {form}
                        </div>
                        <p className="main_content_footer">
                            Habbo is a registered trademark of Sulake Oy. All rights reserved to their respective owners.
                            <br />
                            Made by Relevance. Follow me on <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/josednn/">instagram</a>.
                        </p>
                    </div>
                </div >
            );
        } else {
            return (
                <></>
            );
        }


    }
}

const mapStateToProps = (state: any) => ({
    loginContext: state.login,
});

export default connect(mapStateToProps)(MainContent);

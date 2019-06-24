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
            let form: any = 'Loading...';
            if (gameLoaded) {
                form = <JoinForm />;
            }

            return (
                <div className="main_wrapper">
                    <div className="main_content">
                        <Logo />
                        <hr />
                        <p>
                            Please enter a username and pick a look
                        </p>
                        {form}
                    </div>
                </div>
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

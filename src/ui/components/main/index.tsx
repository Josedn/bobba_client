import React, { Component } from 'react';
import Logo from './Logo';
import JoinForm, { LookGroup } from './JoinForm';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import { connect } from 'react-redux';
import { loadGame } from '../../actions';
import AvatarInfo from '../../../bobba/imagers/avatars/AvatarInfo';
const skins = [
    "hd-190-10.lg-3023-1408.ch-215-91.hr-893-45",
    "hr-828-1407.sh-3089-110.ha-1013-110.ch-3323-110-92.lg-3058-82.hd-180-10",
    "ch-3050-104-62.ea-987462904-62.sh-305-1185.lg-275-1193.hd-185-1.hr-828-1034",
    "sh-725-68.he-3258-1410-92.hr-3012-45.ch-665-110.lg-3006-110-110.hd-600-28",
    "ha-1003-85.ch-665-92.lg-3328-1338-1338.hd-3105-10.sh-3035-64.hr-3012-1394.ea-3169-110.cc-3008-110-110",
    "ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-600-10",
];

const initialState = {
    looks: [],
    error: '',
};

type MainContentState = {
    looks: LookGroup[],
    error: string,
};

class MainContent extends Component<any, MainContentState> {
    constructor(props: object) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();
        const { dispatch } = this.props;

        if (!game.isStarting) {
            game.loadGame().then(() => {
                const avatarImager = BobbaEnvironment.getGame().avatarImager;
                const promises = [];

                for (let skin of skins) {
                    promises.push(avatarImager.generateGeneric(new AvatarInfo(skin, 4, 4, ["wlk"], "std", 2, false, false, "n"), false).then(image => {
                        return { figure: skin, image };
                    }));
                }

                return Promise.all(promises).then(result => {
                    this.setState({
                        looks: result,
                    });

                    dispatch(loadGame());
                });
            }).catch((err) => {
                this.setState({
                    error: err,
                });
            });
        }
    }

    render() {
        const { gameLoaded, loggedIn } = (this.props).loginContext;
        const { looks, error } = this.state;
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
                        <JoinForm looks={looks} />
                    </>);
            }
            if (error !== '') {
                form = (
                    <p>
                        {error}
                    </p>
                );
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

import React, { Component } from 'react';
import JoinForm, { LookGroup } from './JoinForm';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import AvatarInfo from '../../bobba/imagers/avatars/AvatarInfo';
import GenericSplash from './GenericSplash';
import Loading from './Loading';
import { canvas2Image } from '../misc/GraphicsUtilities';

const skins = [
    "hd-190-10.lg-3023-1408.ch-215-91.hr-893-45",
    "hr-828-1407.sh-3089-110.ha-1013-110.ch-3323-110-92.lg-3058-82.hd-180-10",
    "ch-3050-104-62.ea-987462904-62.sh-305-1185.lg-275-1193.hd-185-1.hr-828-1034",
    "sh-725-68.he-3258-1410-92.hr-3012-45.ch-665-110.lg-3006-110-110.hd-600-28",
    "ha-1003-85.ch-665-92.lg-3328-1338-1338.hd-3105-10.sh-3035-64.hr-3012-1394.ea-3169-110.cc-3008-110-110",
    "ca-1811-62.lg-3018-81.hr-836-45.ch-669-1193.hd-627-10",
];

const initialState = {
    looks: [],
    looksLoaded: 0,
};
type SplashScreenState = {
    looks: LookGroup[],
    looksLoaded: number,
};
type SplashScreenProps = {};

const getPercent = (current: number, max: number) => {
    return Math.trunc((current / max) * 100);
};

class SplashScreen extends Component<SplashScreenProps, SplashScreenState> {
    constructor(props: SplashScreenProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const avatarImager = BobbaEnvironment.getGame().avatarImager;

        skins.forEach(skin => {
            avatarImager.generateGeneric(new AvatarInfo(skin, 4, 4, ["wlk"], "std", 2, false, false, "n"), false).then(canvas => {
                const looks = this.state.looks.concat({ figure: skin, image: canvas2Image(canvas) });
                this.setState({
                    looks,
                });
            });
        });

    }

    render() {
        const { looks } = this.state;

        if (looks.length !== skins.length) {
            return <Loading loadingText={"Loading sample looks (" + getPercent(looks.length, skins.length) + "%)"} />;
        }
        return (
            <GenericSplash>
                <p>
                    Please enter your username and pick a look!
                </p>
                <JoinForm looks={looks} />
            </GenericSplash>
        );
    }
}

export default SplashScreen;

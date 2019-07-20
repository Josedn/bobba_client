import React, { Component } from 'react';
import Footer from './footer/Footer';
import './App.css';
import RoomInfo from './roominfo/RoomInfo';
import TopBar from './header/TopBar';
import Header from './header/Header';
import SplashScreen from './splash/SplashScreen';
import ItemInfoContainer from './iteminfo/ItemInfoContainer';
import BobbaEnvironment from '../bobba/BobbaEnvironment';
import Loading from './splash/Loading';
import ErrorSplash from './splash/ErrorSplash';
import AvatarInfo from '../bobba/imagers/avatars/AvatarInfo';
import { canvas2Image } from './misc/GraphicsUtilities';
import ChangeLooks from './changelooks/ChangeLooks';
import Inventory from './inventory/Inventory';
import Catalogue from './catalogue/Catalogue';
import Notifications from './notifications/Notifications';
import Navigator from './navigator/Nav';
import CreateRoom from './createroom/CreateRoom';
import Messenger from './messenger/Messenger';

type UserData = {
    id: number,
    name: string,
    motto: string,
    look: string,
    image?: HTMLImageElement,
};
const initialUserData = {
    id: -1,
    name: '',
    motto: '',
    look: '',
};

type BobbaUIProps = {};
type BobbaUIState = {
    gameLoaded: boolean,
    loggedIn: boolean,
    error: string,
    loadingInfo: string,
    userData: UserData,
};
const initialState = {
    gameLoaded: false,
    loggedIn: false,
    error: '',
    loadingInfo: '',
    userData: initialUserData,
};
class BobbaUI extends Component<BobbaUIProps, BobbaUIState> {
    constructor(props: BobbaUIProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();

        game.uiManager.setOnLoadHandler((text: string) => {
            this.setState({
                loadingInfo: text,
            });
        });

        game.loadGame().then(() => {
            this.setState({
                gameLoaded: true,
            });

            game.uiManager.setOnGameStopHandler(() => {
                this.setState({
                    error: 'Game has stoppped!',
                });
            });

            //AUTO LOGIN 
            game.uiManager.doLogin('Jose', 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45');
        }).catch(err => {
            this.setState({
                gameLoaded: false,
                loggedIn: false,
                error: err,
            });
        });

        game.uiManager.setOnSetUserDataHandler(user => {
            game.avatarImager.generateGeneric(new AvatarInfo(user.look, 2, 2, ["std"], "std", 0, true, false, "n"), false).then(canvas => {
                this.setState({
                    loggedIn: true,
                    userData: {
                        id: user.id, name: user.name, look: user.look, motto: user.motto, image: canvas2Image(canvas),
                    }
                });
            });
            //AUTO NAV
            //game.uiManager.doOpenNavigator();
        });

    }

    updateChatFocuser = (handler: () => void) => {
        const game = BobbaEnvironment.getGame();
        game.uiManager.setOnFocusChatHandler(handler);
    }

    render() {
        const { gameLoaded, error, loggedIn, loadingInfo, userData } = this.state;


        let mainPage = <></>;
        if (error !== '') {
            mainPage = <ErrorSplash errorText={error} />
        } else if (!gameLoaded) {
            mainPage = <Loading loadingText={loadingInfo} />
        } else if (!loggedIn) {
            mainPage = <SplashScreen />;
        }

        return (
            <>
                <Header />
                <TopBar />
                {mainPage}
                <ChangeLooks />
                <Catalogue />
                <Inventory />
                <Navigator />
                <CreateRoom />
                <Messenger />
                <Notifications />
                <RoomInfo />
                <ItemInfoContainer />
                <Footer focuser={this.updateChatFocuser} headImage={userData.image} />
            </>
        );
    }
}

export default BobbaUI;

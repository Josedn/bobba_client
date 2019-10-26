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
import Chat from './messenger/Chat';

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
    initialized: boolean,
    loadingInfo: string,
    userData: UserData,
};
const initialState = {
    gameLoaded: false,
    loggedIn: false,
    error: '',
    loadingInfo: '',
    userData: initialUserData,
    initialized: false,
};
class BobbaUI extends Component<BobbaUIProps, BobbaUIState> {
    constructor(props: BobbaUIProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        try {
            const game = BobbaEnvironment.getGame();

            game.uiManager.onLoadPost = ((text: string) => {
                this.setState({
                    loadingInfo: text,
                });
            });

            game.loadGame().then(() => {
                this.setState({
                    gameLoaded: true,
                });

                game.uiManager.onGameStop = (() => {
                    this.setState({
                        error: 'Game has stoppped!',
                    });
                });

                //AUTO LOGIN 
                //game.uiManager.doLogin('Jose', 'hd-190-10.lg-3023-1408.ch-215-91.hr-893-45');
            }).catch(err => {
                let errorMessage = err;

                if (err instanceof Error) {
                    errorMessage = err.message;
                }

                this.setState({
                    gameLoaded: false,
                    loggedIn: false,
                    error: errorMessage,
                });
            });

            game.uiManager.onSetUserData = (user => {
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

            this.setState({
                initialized: true,
            });

            //debug
            const win: any = window;
            win.mainGame = game;
        }
        catch (err) {
            let errorMessage = err;

            if (err instanceof Error) {
                if (err.message.includes("WebGL unsupported")) {
                    errorMessage = "Please enable hardware acceleration.";
                }
            }

            this.setState({
                error: errorMessage,
            });
        }

    }

    updateChatFocuser = (handler: () => void) => {
        const game = BobbaEnvironment.getGame();
        game.uiManager.onFocusChat = (handler);
    }

    render() {
        const { gameLoaded, error, loggedIn, loadingInfo, userData, initialized } = this.state;

        let mainPage = <></>;
        if (error !== '') {
            mainPage = <ErrorSplash errorText={error} />
        } else if (!gameLoaded) {
            mainPage = <Loading loadingText={loadingInfo} />
        } else if (!loggedIn) {
            mainPage = <SplashScreen />;
        }

        if (initialized) {
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
                    <Chat />
                    <Notifications />
                    <RoomInfo />
                    <ItemInfoContainer />
                    <Footer focuser={this.updateChatFocuser} headImage={userData.image} />
                </>
            );
        }

        return mainPage;
    }
}

export default BobbaUI;

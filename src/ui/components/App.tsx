import React, { Component } from 'react';
import Footer from './footer/Footer';
import './App.css';
import RoomInfo from './roominfo/RoomInfo';
import TopBar from './topbar/TopBar';
import Header from './header/Header';
import SplashScreen from './splash/SplashScreen';
import ItemInfoContainer from './iteminfo/ItemInfoContainer';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import Loading from './splash/Loading';
import ErrorSplash from './splash/ErrorSplash';

type AppProps = {};
type AppState = {
    gameLoaded: boolean,
    loggedIn: boolean,
    error: string,
    loadingInfo: string,
};
const initialState = {
    gameLoaded: false,
    loggedIn: false,
    error: '',
    loadingInfo: '',
};
class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
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
        }).catch(err => {
            this.setState({
                gameLoaded: false,
                loggedIn: false,
                error: err,
            });
        });

        game.uiManager.setLoggedInHandler(() => {
            this.setState({
                loggedIn: true,
            });
        });
        
    }

    render() {

        const { gameLoaded, error, loggedIn, loadingInfo } = this.state;

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
                {mainPage}
                <TopBar />
                <RoomInfo />
                <ItemInfoContainer />
                <Footer />
            </>
        );
    }
}

export default App;

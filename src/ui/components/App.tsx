import React, { Component } from 'react';
import Footer from './footer/Footer';
import './App.css';
import RoomInfo from './roominfo/RoomInfo';
import TopBar from './topbar/TopBar';
import Header from './header/Header';
import MainContent from './main/MainContent';
import ItemInfoContainer from './iteminfo/ItemInfoContainer';

class App extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <>
                <Header />
                <MainContent />
                <TopBar />
                <RoomInfo />
                <ItemInfoContainer />
                <Footer />
            </>
        );
    }
}

export default App;

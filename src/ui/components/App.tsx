import React, { Component } from 'react';
import Footer from './footer';
import './App.css';
import RoomInfo from './roominfo';
import TopBar from './topbar';
import Header from './header';
import MainContent from './main';

class App extends Component {

    render() {
        return (
            <>
                <Header />
                <MainContent />
                <TopBar />
                <RoomInfo />
                <Footer />
            </>
        );
    }
}

export default App;

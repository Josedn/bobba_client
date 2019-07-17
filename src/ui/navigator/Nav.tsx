import React, { ReactNode, ChangeEvent, FormEvent } from 'react';
import WindowManager from '../windows/WindowManager';
import Draggable from 'react-draggable';
import './nav.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import RoomData from '../../bobba/navigator/RoomData';

type MainTabId = 'rooms' | 'me' | 'search';
type NavigatorProps = {};
type NavigatorState = {
    visible: boolean,
    zIndex: number,
    mainTabId: MainTabId,
    search: string,
    currentRooms?: RoomData[],
};
const initialState: NavigatorState = {
    visible: false,
    mainTabId: 'rooms',
    search: '',
    zIndex: WindowManager.getNextZIndex(),
    currentRooms: undefined,
};
export default class Navigator extends React.Component<NavigatorProps, NavigatorState> {
    constructor(props: NavigatorProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();

        game.uiManager.setOnOpenNavigatorHandler(() => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex(),
            });
        });

        game.uiManager.setOnCloseNavigatorHandler(() => {
            this.setState({
                visible: false,
            });
        });

        game.uiManager.setOnLoadRoomListHandler((rooms) => {
            this.setState({
                currentRooms: rooms,
            });
        });
    }

    close = () => {
        this.setState({
            visible: false,
        });
    }

    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }

    generateTabs(): ReactNode {
        const { mainTabId } = this.state;
        return (
            <>
                <button onClick={this.handleMainTabChange('rooms')} className={mainTabId === 'rooms' ? 'selected' : ''}>
                    Salas
                </button>
                <button onClick={this.handleMainTabChange('me')} className={mainTabId === 'me' ? 'selected' : ''}>
                    Yo
                </button>
                <button onClick={this.handleMainTabChange('search')} className={mainTabId === 'search' ? 'selected' : ''}>
                    Buscar
                </button>
            </>
        );
    }

    handleMainTabChange = (mainTabId: MainTabId) => () => {
        switch (mainTabId) {
            case 'me':
                BobbaEnvironment.getGame().uiManager.doRequestNavigatorMyRooms();
                break;
            case 'rooms':
                BobbaEnvironment.getGame().uiManager.doRequestNavigatorRooms();
                break;
        }
        this.setState({
            mainTabId,
            currentRooms: undefined,
        });
    }

    handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            search: event.target.value,
        });
    }

    handleSearch = (event: FormEvent<HTMLFormElement>) => {
        const { search } = this.state;
        event.preventDefault();
        this.setState({
            mainTabId: 'search',
        });
        BobbaEnvironment.getGame().uiManager.doRequestNavigatorSearch(search);
    }

    generateGrid(): ReactNode {
        const { currentRooms } = this.state;

        if (currentRooms == null) {
            return (
                <p>
                    Loading...
                </p>
            );
        }
        return currentRooms.map(roomData => {
            return (
                <button>
                    {roomData.name}
                </button>
            )
        });
    }

    render() {
        const { visible, zIndex, search } = this.state;
        if (!visible) {
            return <></>;
        }

        return (
            <Draggable defaultClassName="nav" handle=".title" onStart={() => { this.upgradeZIndex() }}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
                    <h2 className="title">
                        Navegador
                    </h2>
                    <hr />
                    <div className="main_tab_container">
                        {this.generateTabs()}
                    </div>
                    <div className="wrapper">
                        <div className="search_bar">
                            <form onSubmit={this.handleSearch}>
                                <input autoComplete="off" type="text" onChange={this.handleSearchChange} value={search} name="room_search" placeholder="Escribe tu búsqueda" />
                                <button>Buscar</button>
                            </form>
                        </div>
                        <div className="basic_rooms">
                            {this.generateGrid()}
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
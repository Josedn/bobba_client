import React, { ReactNode, ChangeEvent, FormEvent } from 'react';
import WindowManager from '../windows/WindowManager';
import Draggable from 'react-draggable';
import './nav.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import RoomData, { LockType } from '../../bobba/navigator/RoomData';

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
    visible: true,
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

        game.uiManager.onOpenNavigator = (() => {
            const { mainTabId } = this.state;
            this.requestRoomList(mainTabId);
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex(),
            });
        });

        game.uiManager.onCloseNavigator = (() => {
            this.setState({
                visible: false,
            });
        });

        game.uiManager.onLoadRoomList = ((rooms) => {
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
                    Rooms
                </button>
                <button onClick={this.handleMainTabChange('me')} className={mainTabId === 'me' ? 'selected' : ''}>
                    Me
                </button>
                <button onClick={this.handleMainTabChange('search')} className={mainTabId === 'search' ? 'selected' : ''}>
                    Search
                </button>
            </>
        );
    }

    requestRoomList(mainTabId: MainTabId) {
        switch (mainTabId) {
            case 'me':
                BobbaEnvironment.getGame().uiManager.doRequestNavigatorMyRooms();
                break;
            case 'rooms':
                BobbaEnvironment.getGame().uiManager.doRequestNavigatorRooms();
                break;
        }
    }

    handleMainTabChange = (mainTabId: MainTabId) => () => {
        const { search } = this.state;
        if (mainTabId === 'search') {
            this.setState({
                mainTabId,
                currentRooms: [],
            });
            if (search.length > 0) {
                BobbaEnvironment.getGame().uiManager.doRequestNavigatorSearch(search);
            }
        } else {
            this.setState({
                mainTabId,
                currentRooms: undefined,
            });
            this.requestRoomList(mainTabId);
        }
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
            currentRooms: undefined,
        });
        BobbaEnvironment.getGame().uiManager.doRequestNavigatorSearch(search);
    }

    handleGoToRoom = (roomId: number) => () => {
        BobbaEnvironment.getGame().uiManager.doRequestGoToRoom(roomId);
    }

    handleCreateRoom = () => {
        BobbaEnvironment.getGame().uiManager.doOpenCreateRoom();
    }

    calculateUserCountColor(userCount: number, capacity: number): string {
        if (userCount === 0) {
            return '';
        }
        return 'g';
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
        return currentRooms
            .sort((a, b) => b.userCount - a.userCount)
            .map(roomData => {
                let lockIcon = <></>;
                if (roomData.lockType === LockType.Locked) {
                    lockIcon = <button className="door_bell" />;
                } else if (roomData.lockType === LockType.Password) {
                    lockIcon = <button className="door_password" />;
                }
                return (

                    <div className="room_button" key={roomData.id} onClick={this.handleGoToRoom(roomData.id)}>
                        <span>{roomData.name.substr(0, 30)}</span>
                        <div className="icons_container">
                            {lockIcon}
                            <button className={roomData.isFavourite ? 'favourite' : 'make_favourite'} />
                            <button className={"usercount " + this.calculateUserCountColor(roomData.userCount, roomData.capacity)}>{roomData.userCount}</button>
                        </div>

                    </div>
                )
            });
    }

    render() {
        const { visible, zIndex, search } = this.state;
        if (!visible) {
            return <></>;
        }

        return (
            <Draggable defaultClassName="nav" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
                    <h2 className="title">
                        Navigator
                    </h2>
                    <hr />
                    <div className="main_tab_container">
                        {this.generateTabs()}
                    </div>
                    <div className="wrapper">
                        <div className="search_bar">
                            <form onSubmit={this.handleSearch}>
                                <input autoComplete="off" type="text" onChange={this.handleSearchChange} value={search} name="room_search" placeholder="Search a room..." />
                                <button>Search</button>
                            </form>
                        </div>
                        <div className="basic_rooms">
                            {this.generateGrid()}
                        </div>
                        <div className="more_rooms">
                            <div className="info">
                                <img src="images/navigator/create_room.png" alt="More rooms" />
                                <span>More rooms?</span>
                            </div>
                            <button onClick={this.handleCreateRoom}>Create room</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
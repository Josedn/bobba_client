import React from 'react';
import WindowManager from '../windows/WindowManager';
import Draggable from 'react-draggable';
import './nav.css';

type NavigatorProps = {};
type NavigatorState = {
    visible: boolean,
    zIndex: number,
};
const initialState = {
    visible: true,
    zIndex: 99999
};
export default class Navigator extends React.Component<NavigatorProps, NavigatorState> {
    constructor(props: NavigatorProps) {
        super(props);
        this.state = initialState;
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

    render() {
        const { visible, zIndex } = this.state;
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
                        <button className="selected">
                            Principales
                        </button>
                        <button>
                            Salas
                        </button>
                        <button>
                            Eventos
                        </button>
                        <button>
                            Yo
                        </button>
                        <button>
                            Buscar
                        </button>
                    </div>
                    <div className="wrapper">
                        <div className="search_bar">
                            <input type="text" name="room_search" placeholder="Escribe tu búsqueda" />
                            <button>Buscar</button>
                        </div>
                        <div className="basic_rooms">
                            <button>
                                this a sample room
                            </button>
                            <button>
                                this another sample room
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
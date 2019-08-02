import React, { FormEvent, ChangeEvent } from "react";
import Draggable from "react-draggable";
import WindowManager from "../windows/WindowManager";
import './createroom.css';
import BobbaEnvironment from "../../bobba/BobbaEnvironment";

type Model = {
    id: string,
    tileCount: number,
};

const models: Model[] = [
    { tileCount: 104, id: 'model_a' },
    { tileCount: 94, id: 'model_b' },
    { tileCount: 36, id: 'model_c' },
    { tileCount: 84, id: 'model_d' },
    { tileCount: 80, id: 'model_e' },
    { tileCount: 80, id: 'model_f' },
    { tileCount: 416, id: 'model_i' },
    { tileCount: 320, id: 'model_j' },
    { tileCount: 448, id: 'model_k' },
    { tileCount: 352, id: 'model_l' },
    { tileCount: 384, id: 'model_m' },
    { tileCount: 372, id: 'model_n' },
    { tileCount: 80, id: 'model_g' },
    { tileCount: 74, id: 'model_h' },
    { tileCount: 416, id: 'model_o' },
    { tileCount: 352, id: 'model_p' },
    { tileCount: 304, id: 'model_q' },
    { tileCount: 336, id: 'model_r' },
    { tileCount: 748, id: 'model_u' },
    { tileCount: 438, id: 'model_v' },
    { tileCount: 540, id: 'model_t' },
    { tileCount: 512, id: 'model_w' },
    { tileCount: 396, id: 'model_x' },
    { tileCount: 440, id: 'model_y' },
    { tileCount: 456, id: 'model_z' },
    { tileCount: 208, id: 'model_0' },
];

type CreateRoomProps = {};
type CreateRoomState = {
    zIndex: number,
    visible: boolean,
    selectedModel: string,
    name: string,
};
const initialState = {
    zIndex: WindowManager.getNextZIndex(),
    visible: false,
    selectedModel: models[0].id,
    name: '',
};

export default class CreateRoom extends React.Component<CreateRoomProps, CreateRoomState> {
    constructor(props: CreateRoomProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();

        game.uiManager.onOpenCreateRoom = (() => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex(),
            });
        });

        game.uiManager.onCloseCreateRoom = (() => {
            this.setState({
                visible: false,
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

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const { name, selectedModel } = this.state;
        event.preventDefault();
        if (name.length > 0) {
            BobbaEnvironment.getGame().uiManager.doRequestCreateRoom(name, selectedModel);
        }
    }

    handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: event.target.value,
        });
    }

    handleSelect = (selectedModel: string) => () => {
        this.setState({
            selectedModel
        });
    }

    generateGrid(): React.ReactNode {
        const { selectedModel } = this.state;
        return models.map(model => {
            return (
                <button key={model.id} onClick={this.handleSelect(model.id)} className={selectedModel === model.id ? 'selected' : ''}>
                    <img src={"images/navigator/" + model.id + ".png"} alt={model.id} />
                    <div className="tile_count">
                        <img src="images/navigator/tile_icon_black.png" alt={model.tileCount + " tiles"} />
                        <span>{model.tileCount} tiles</span>
                    </div>
                </button>
            );
        });
    }

    render() {
        const { visible, zIndex, name } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable defaultClassName="createroom" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
                    <h2 className="title">
                        Create a room
                    </h2>
                    <hr />
                    <div className="wrapper">
                        <h2>Choose style</h2>
                        <div className="grid">
                            {this.generateGrid()}
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <h2>Room name</h2>
                            <input maxLength={33} onChange={this.handleNameChange} value={name} type="text" placeholder="Room name" />
                            <div className="button_container">
                                <button>
                                    Create room
                                </button>
                                <button onClick={this.close}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Draggable>
        );
    }
}
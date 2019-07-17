import React from "react";
import Draggable from "react-draggable";
import './notifications.css';
import WindowManager from "../windows/WindowManager";

type NotifProps = {
    text: string,
    id: number,
};
type NotifState = {
    visible: boolean,
    zIndex: number,
};
export default class Notif extends React.Component<NotifProps, NotifState> {
    constructor(props: NotifProps) {
        super(props);
        this.state = {
            visible: true,
            zIndex: WindowManager.getNextZIndex(),
        };
    }
    handleClose = () => {
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
        const { text, id } = this.props;
        if (!visible) {
            return <></>;
        }

        return (
            <Draggable key={id} handle=".handle" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div className="notification" style={{ zIndex }}>
                    <button className="close" onClick={this.handleClose}>
                        X
                    </button>
                    <h2 className="handle">Alert</h2>
                    <hr />
                    <div className="wrapper">
                        <div className="first_row">
                            <span>{text}</span>
                        </div>
                        <div className="second_row">
                            <button onClick={this.handleClose}>Ok</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}

import React from "react";
import Draggable from "react-draggable";
import './notifications.css';

type NotifProps = {
    text: string,
};
type NotifState = {
    visible: boolean,
};
export default class Notif extends React.Component<NotifProps, NotifState> {
    constructor(props: NotifProps) {
        super(props);
        this.state = {
            visible: true,
        };
    }
    handleClose = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { visible } = this.state;
        const { text } = this.props;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable handle=".handle">
                <div className="notification">
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

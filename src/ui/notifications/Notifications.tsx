import React from "react";
import BobbaEnvironment from "../../bobba/BobbaEnvironment";
import Notif from "./Notif";

type NotificationsProps = {};
type NotificationsState = {
    notifications: string[],
};

const initialState = {
    notifications: [],
};

export default class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor(props: NotificationsProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.onShowNotification = ((text: string) => {
            const { notifications } = this.state;
            this.setState({
                notifications: notifications.concat(text),
            });
        });
    }

    render() {
        const { notifications } = this.state;
        let i = 0;
        return notifications.map(text => {
            return <Notif id={i++} text={text} />
        });
    }
}
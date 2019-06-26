import React, { Component } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import FurniInfo, { FurniInfoProps } from './FurniInfo';
import UserInfo, { UserInfoProps } from './UserInfo';
import { canvas2Image } from '../misc/GraphicsUtilities';
enum Showing {
    USER, FURNI, NONE
}
type ItemInfoContainerProps = {
    currentUserId: number,
};
type ItemInfoContainerState = {
    showing: Showing,
    furniProps: FurniInfoProps,
    userProps: UserInfoProps,
};
const initialFurniProps = {
    showing: true,
    name: '',
    description: '',
    itemId: -1,
};
const initialUserProps = {
    showing: true,
    name: '',
    motto: '',
    userId: -1,
    isMe: false,
};
const initialState: ItemInfoContainerState = {
    showing: Showing.FURNI,
    furniProps: initialFurniProps,
    userProps: initialUserProps,
};
class ItemInfoContainer extends Component<ItemInfoContainerProps, ItemInfoContainerState> {
    constructor(props: ItemInfoContainerProps) {
        super(props);
        this.state = initialState;
    }

    close = () => {
        this.setState({
            showing: Showing.NONE,
        });
    }

    componentDidUpdate() {
        const { currentUserId } = this.props;
        BobbaEnvironment.getGame().uiManager.onSelectFurni = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement) => {
            this.setState({
                furniProps: {
                    itemId: id,
                    name,
                    description,
                    image: canvas2Image(image),
                },
                showing: Showing.FURNI
            });
        };

        BobbaEnvironment.getGame().uiManager.onSelectUser = (id: number, name: string, motto: string, look: string, image: HTMLCanvasElement) => {
            this.setState({
                userProps: {
                    userId: id,
                    name,
                    motto,
                    image: canvas2Image(image),
                    isMe: id === currentUserId,
                },
                showing: Showing.USER
            });
        };

    }

    render() {
        const { showing, furniProps, userProps } = this.state;

        if (showing === Showing.FURNI) {
            return (
                <FurniInfo {...furniProps} onClose={this.close} />
            );
        } else if (showing === Showing.USER) {
            return (
                <UserInfo {...userProps} onClose={this.close} />
            )
        }
        return (
            <></>
        );
    }
}

export default ItemInfoContainer;
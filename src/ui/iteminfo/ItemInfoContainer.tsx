import React, { Component } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import FurniInfo, { FurniInfoProps } from './FurniInfo';
import UserInfo, { UserInfoProps } from './UserInfo';
import { canvas2Image } from '../misc/GraphicsUtilities';
import './iteminfo.css';
enum Showing {
    USER, FURNI, NONE
}
type ItemInfoContainerProps = {};
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
    canRotate: false,
    canMove: false,
    canPickUp: false,
    canUse: false,
};
const initialUserProps = {
    showing: true,
    name: '',
    motto: '',
    userId: -1,
    isMe: false,
};
const initialState: ItemInfoContainerState = {
    showing: Showing.NONE,
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

    showFurniView = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement, isUpdate: boolean, canMove: boolean, canRotate: boolean, canPickUp: boolean, canUse: boolean) => {
        const currentId = this.state.furniProps.itemId;
        if ((isUpdate && this.state.showing === Showing.FURNI && currentId === id) || !isUpdate) {
            this.setState({
                furniProps: {
                    itemId: id,
                    name,
                    description,
                    image: canvas2Image(image),
                    canRotate,
                    canMove,
                    canPickUp,
                    canUse,
                },
                showing: Showing.FURNI
            });
        }
    }

    showUserView = (id: number, name: string, motto: string, look: string, isMe: boolean, image: HTMLCanvasElement, isUpdate: boolean) => {
        const currentId = this.state.userProps.userId;
        if ((isUpdate && this.state.showing === Showing.USER && currentId === id) || !isUpdate) {
            this.setState({
                userProps: {
                    userId: id,
                    name,
                    motto,
                    image: canvas2Image(image),
                    isMe,
                },
                showing: Showing.USER
            });
        }
    }

    tryCloseFurniView = (itemId: number) => {
        const id = this.state.furniProps.itemId;
        if (itemId === id || itemId === -1) {
            this.close();
        }
    }

    tryCloseUserView = (userId: number) => {
        const id = this.state.userProps.userId;
        if (userId === id || userId === -1) {
            this.close();
        }
    }

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.onSelectFurni = this.showFurniView;
        BobbaEnvironment.getGame().uiManager.onSelectUser = this.showUserView;
        BobbaEnvironment.getGame().uiManager.onCloseSelectFurni = this.tryCloseFurniView;
        BobbaEnvironment.getGame().uiManager.onCloseSelectUser = this.tryCloseUserView;
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
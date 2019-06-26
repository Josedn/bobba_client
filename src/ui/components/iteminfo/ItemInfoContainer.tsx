import React, { Component } from 'react';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import FurniInfo, { FurniInfoProps } from './FurniInfo';
import UserInfo, { UserInfoProps } from './UserInfo';
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
};
const initialUserProps = {
    showing: true,
    name: '',
    motto: '',
    userId: -1,
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

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.onSelectFurni = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement) => {
            const imgFoo = document.createElement('img');
            imgFoo.src = image.toDataURL();
            this.setState({
                furniProps: {
                    itemId: id,
                    name,
                    description,
                    image: imgFoo
                },
                showing: Showing.FURNI
            });
        };

        BobbaEnvironment.getGame().uiManager.onSelectUser = (id: number, name: string, motto: string, image: HTMLCanvasElement) => {
            const imgFoo = document.createElement('img');
            imgFoo.src = image.toDataURL();
            this.setState({
                userProps: {
                    userId: id,
                    name,
                    motto,
                    image: imgFoo
                },
                showing: Showing.USER
            });
        };

    }

    render() {
        const { showing, furniProps, userProps } = this.state;

        if (showing === Showing.FURNI) {
            return (
                <FurniInfo {...furniProps} />
            );
        } else if (showing === Showing.USER) {
            return (
                <UserInfo {...userProps} />
            )
        }
        return (
            <></>
        );
    }
}

export default ItemInfoContainer;
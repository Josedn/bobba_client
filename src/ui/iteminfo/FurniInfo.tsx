import React, { Component, ReactNode } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import { FLOOR_ITEM_PLACEHOLDER } from '../../bobba/graphics/GenericSprites';

export type FurniInfoProps = {
    name: string,
    description: string,
    itemId: number,
    image?: HTMLImageElement,
    canRotate: boolean,
    canMove: boolean,
    canPickUp: boolean,
    canUse: boolean,
    onClose?: () => void,
};

class FurniInfo extends Component<FurniInfoProps> {

    useItem = () => {
        const { itemId } = this.props;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniInteract(itemId);
        }
    }

    moveItem = () => {
        const { itemId } = this.props;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniMove(itemId);
        }
    }

    rotateItem = () => {
        const { itemId } = this.props;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniRotate(itemId);
        }
    }

    pickUpItem = () => {
        const { itemId } = this.props;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniPickUp(itemId);
        }
    }

    render() {
        const { name, description, image, onClose, canRotate, canMove, canPickUp, canUse } = this.props;
        let src = FLOOR_ITEM_PLACEHOLDER;
        if (image != null && image.src != null) {
            src = image.src;
        }
        let buttons: ReactNode[] = [];

        if (canMove) {
            buttons.push(
                <button key="move" onClick={this.moveItem}>
                    Move
                </button>
            );
        }

        if (canRotate) {
            buttons.push(
                <button key="rotate" onClick={this.rotateItem}>
                    Rotate
                </button>
            );
        }

        if (canPickUp) {
            buttons.push(
                <button key="pickup" onClick={this.pickUpItem}>
                    Pick up
                </button>
            );
        }

        if (canUse) {
            buttons.push(
                <button key="use" onClick={this.useItem}>
                    Use
                </button>
            );
        }

        return (
            <>
                <div className={"item_info" + (buttons.length === 0 ? " no_buttons" : "")}>
                    <button className="close" onClick={onClose}>
                        X
                    </button>
                    <h2 className="title">{name}</h2>
                    <hr />
                    <div className="image_container">
                        <img src={src} alt={name} />
                    </div>
                    <hr />
                    <p>
                        {description}
                    </p>
                </div >
                <div className="item_info_button_container">
                    {buttons}
                </div>
            </>
        );
    }
}

export default FurniInfo;
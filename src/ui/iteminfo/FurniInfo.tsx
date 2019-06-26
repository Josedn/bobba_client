import React, { Component } from 'react';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import { FLOOR_ITEM_PLACEHOLDER } from '../../bobba/graphics/GenericSprites';

export type FurniInfoProps = {
    name: string,
    description: string,
    itemId: number,
    image?: HTMLImageElement,
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
        const { name, description, image, onClose } = this.props;
        let src = FLOOR_ITEM_PLACEHOLDER;
        if (image != null && image.src != null) {
            src = image.src;
        }
        return (
            <>
                <div className="item_info">
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
                    <button onClick={this.moveItem}>
                        Move
                    </button>
                    <button onClick={this.rotateItem}>
                        Rotate
                    </button>
                    <button onClick={this.pickUpItem}>
                        Pick up
                    </button>
                    <button onClick={this.useItem}>
                        Use
                    </button>
                </div>
            </>
        );
    }
}

export default FurniInfo;
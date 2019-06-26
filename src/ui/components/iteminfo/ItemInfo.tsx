import React, { Component } from 'react';
import BobbaEnvironment from '../../../bobba/BobbaEnvironment';
import { FLOOR_ITEM_PLACEHOLDER } from '../../../bobba/graphics/GenericSprites';
type ItemInfoProps = {};
type ItemInfoState = {
    showing: boolean,
    name: string,
    description: string,
    itemId: number,
    image?: HTMLImageElement,
};
const initialState = {
    showing: false,
    name: '',
    description: '',
    itemId: -1,
};
class ItemInfo extends Component<ItemInfoProps, ItemInfoState> {

    constructor(props: ItemInfoProps) {
        super(props);
        this.state = initialState;
    }

    useItem = () => {
        const { itemId } = this.state;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniInteract(itemId);
        }
    }

    moveItem = () => {
        const { itemId } = this.state;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniMove(itemId);
        }
    }

    rotateItem = () => {
        const { itemId } = this.state;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniRotate(itemId);
        }
    }

    pickUpItem = () => {
        const { itemId } = this.state;
        if (itemId !== -1) {
            BobbaEnvironment.getGame().uiManager.doFurniPickUp(itemId);
        }
    }

    componentDidMount() {
        BobbaEnvironment.getGame().uiManager.onSelectFurni = (id: number, baseId: number, name: string, description: string, image: HTMLCanvasElement) => {
            const imgFoo = document.createElement('img');
            imgFoo.src = image.toDataURL();
            this.setState({
                showing: true,
                itemId: id,
                name,
                description,
                image: imgFoo
            });
        };
    }

    render() {
        const { showing, name, description, image } = this.state;
        if (!showing) {
            return (<></>);
        }
        let src = FLOOR_ITEM_PLACEHOLDER;
        if (image != null && image.src != null) {
            src = image.src;
        }
        return (
            <>
                <div className="item_info">
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

export default ItemInfo;
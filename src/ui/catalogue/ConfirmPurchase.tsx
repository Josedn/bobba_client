import React from "react";
import Draggable from "react-draggable";
import './confirmpurchase.css';
import CatalogueItem from "../../bobba/catalogue/CatalogueItem";
import { canvas2Image } from "../misc/GraphicsUtilities";
import WindowManager from "../windows/WindowManager";

type ConfirmPurchaseProps = {
    item: CatalogueItem,
    onClose: () => void,
    onPurchase: () => void,
};
type ConfirmPurchaseState = {
    visible: boolean,
    zIndex: number,
};
const initialState: ConfirmPurchaseState = {
    visible: true,
    zIndex: WindowManager.getNextZIndex(),
};

export default class ConfirmPurchase extends React.Component<ConfirmPurchaseProps, ConfirmPurchaseState> {

    constructor(props: ConfirmPurchaseProps) {
        super(props);
        this.state = initialState;
    }

    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }

    render() {
        const { item, onClose, onPurchase } = this.props;
        const { zIndex } = this.state;
        if (item.baseItem == null) {
            return <></>;
        }
        const image = canvas2Image(item.baseItem.iconImage);
        return (
            <Draggable handle=".handle" onStart={() => { this.upgradeZIndex() }}>
                <div className="catalogue_confirm_purchase" style={{ zIndex }}>
                    <button className="close" onClick={onClose}>
                        X
                    </button>
                    <h2 className="handle">Confirmar compra</h2>
                    <hr />
                    <div className="wrapper">
                        <div className="first_row">
                            <button>
                                <img src={image.src} alt={item.baseItem.furniBase.itemData.name} />
                            </button>
                            <h2>
                                {item.baseItem.furniBase.itemData.name}
                            </h2>
                        </div>
                        <div className="second_row">
                            <p>
                                {item.baseItem.furniBase.itemData.name} cuesta {item.cost} crédito{item.cost === 1 ? '' : 's'}.
                            </p>
                            <p>
                                Tienes 420 créditos.
                            </p>
                        </div>
                        <div className="third_row">
                            <button onClick={onPurchase}>Comprar</button>
                            <button>Regalar</button>
                            <button onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
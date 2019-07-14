import React from "react";
import Draggable from "react-draggable";
import './confirmpurchase.css';

type ConfirmPurchaseProps = {};
type ConfirmPurchaseState = {
    visible: boolean;
};
const initialState: ConfirmPurchaseState = {
    visible: true,
};

export default class ConfirmPurchase extends React.Component<ConfirmPurchaseProps, ConfirmPurchaseState> {

    constructor(props: ConfirmPurchaseProps) {
        super(props);
        this.state = initialState;
    }

    render() {
        return (
            <Draggable handle=".handle">
                <div className="catalogue_confirm_purchase">
                    <button className="close">
                        X
                    </button>
                    <h2 className="handle">Confirmar compra</h2>
                    <hr />
                    <div className="wrapper">
                        <div className="first_row">
                            <button>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAACl0lEQVRIS7WWQWsTQRTHZ2OUIEJV6EGtORRB8FJaGwweihR61S8gItrSg0jBox/AL1Ck1IpI6BfQqyAiqJWUKiiCFw9tUWgPkkPBQ9LI/2X/0zezM5utxLlsdndmfv/3z3tvNjGDH910yyRv69yXBTURJNNv1yrmefMPfv43sADnuxOOvuVkg/cDB2eAnZcVB/70xvuBRhwF/tjcdMBvVhOz/3ErN/Ii/7EDXKnvmjsPz8umPhDPAOV73KfRZxzIA0cjfPZoy1y76eSUaX3/ZYYunhEw341Wq9YJX0AIXMhSAggkAc9L9T0z1mmJEIyAgIRgK19nKZMmZmko6k/NswLWY+rCcSsAe72+vy211mXt+dAQMGQpnmFMLo7JFXmAERNgwboeQ1H6djKJEDHeEci1R65LA8kIYOQOePbF1WCm4j/TgzBYOl77KVC/jjlfC0D0GfD04ogkAKz1QW9fbVvu1MyIhemIdPk4KtMbCID9zAkbcXnhtKjxaxDrUDoYEADw3NqwjdC3NCSAecIqYHOxWV260msKGFCmS0ALCG2uBcSaC528tb8rh4hkdefrZceho3d3rAD80CLgQMxa31ImIa4AYtybaJvacjsMpgoI0F1I26bhfI4MR9JhjY4Q+6VHpWnOl+PgD9Xe0Vb/ctIce3BCEopdiFEA7Nc5wTpCAtX5LM1KrG6/OxVKRnkGsC4Fgv2uFYsw9kGQC15qtMzC53O2A7EO2Y9ZCX0iDAaVBX/7bScurZeiYE5i0gQsjbp4YPWKMeZSarcCzz6pmEZpWDag3Ye1NEZ3Tidk3Phk284tzx0sY53/a4S+AP88dk/33mx7gumy6PcVmevzIRZ34cbjjXKhT9d+UEZTZB7mFPpQL7rZX4R9hCBJOQXEAAAAAElFTkSuQmCC" alt="Cackatoa" />
                            </button>
                            <h2>
                                Cackatoa
                            </h2>
                        </div>
                        <div className="second_row">
                            <p>
                                Cuackatoa cuesta 10 créditos.
                            </p>
                            <p>
                                Tienes 13674 créditos.
                            </p>
                        </div>
                        <div className="third_row">
                            <button>Comprar</button>
                            <button>Regalar</button>
                            <button>Cancelar</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
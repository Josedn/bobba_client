import React from "react";
import Draggable from "react-draggable";
import './inventory.css';

type InventoryContainerProps = {};
type InventoryContainerState = {
    visible: boolean,
};
const initialState = {
    visible: true,
};
export default class InventoryContainer extends React.Component<InventoryContainerProps, InventoryContainerState> {
    constructor(props: InventoryContainerProps) {
        super(props);
        this.state = initialState;
    }

    render() {
        const { visible } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable defaultClassName="inventory" handle=".title">
                <div>
                    <h2 className="title">
                        Inventory
                    </h2>
                    <hr />
                    <div className="main_tab_container">
                        <button className="selected">
                            Furniture
                        </button>
                        <button>
                            Badges
                        </button>
                    </div>
                    <div className="items_container">
                        <div className="second_tab_container">
                            <button className="selected">
                                Floor
                            </button>
                            <button>
                                Wall
                            </button>
                        </div>
                        <div className="grid_container">
                            <div className="grid">
                                <button className="selected">
                                    <img src="https://images.bobba.io/hof_furni/club_sofa/club_sofa_icon_a.png" alt="F" />
                                    <span>32</span>
                                </button>
                                <button>
                                    <img src="https://images.bobba.io/hof_furni/doorD/doorD_icon_a.png" alt="Furni2" />
                                </button>
                                <button>
                                    <img src="images/avatar_editor/avatar_editor_download_icon.png" alt="Furni2" />
                                </button>
                                <button>
                                    <img src="images/avatar_editor/avatar_editor_download_icon.png" alt="Furni2" />
                                </button>
                                <button>
                                    <img src="images/avatar_editor/avatar_editor_download_icon.png" alt="Furni2" />
                                </button>
                                <button>
                                    <img src="images/avatar_editor/avatar_editor_download_icon.png" alt="Furni2" />
                                </button>
                            </div>
                            <div className="item_preview">
                                <div className="image_container">
                                    <img src="data:image/png;base64,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" alt="Furni" />
                                </div>
                                <div className="item_data">
                                    <h2>
                                        Trendy Rug
                                    </h2>
                                    <p>
                                        Luxurious comfort this is a very large item description lol. xd
                                    </p>
                                    <button>
                                        Place to room
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}
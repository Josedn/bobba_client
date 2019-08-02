import React, { ReactNode } from "react";
import Draggable from "react-draggable";
import './inventory.css';
import BobbaEnvironment from "../../bobba/BobbaEnvironment";
import UserItem from "../../bobba/inventory/UserItem";
import { canvas2Image } from "../misc/GraphicsUtilities";
import { ItemType } from "../../bobba/imagers/furniture/FurniImager";
import { FLOOR_ITEM_PLACEHOLDER } from "../../bobba/graphics/GenericSprites";
import WindowManager from "../windows/WindowManager";
type InventoryContainerProps = {};
type InventoryContainerState = {
    visible: boolean,
    selectedId: number,
    currentType: ItemType,
    items: UserItem[],
    zIndex: number,
};
const initialState = {
    visible: false,
    selectedId: -1,
    currentType: ItemType.FloorItem,
    items: [],
    zIndex: WindowManager.getNextZIndex(),
};
export default class InventoryContainer extends React.Component<InventoryContainerProps, InventoryContainerState> {
    constructor(props: InventoryContainerProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();
        game.uiManager.onOpenInventory = (() => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex()
            });
        });

        game.uiManager.onUpdateInventory = (items => {
            this.setState({
                items,
            });
        });

        game.uiManager.onCloseInventory = (() => {
            this.setState({
                visible: false,
            });
        });
    }

    handleSelectItem = (selectedId: number) => () => {
        this.setState({
            selectedId
        });
    }

    placeItem = () => {
        const { selectedId } = this.state;
        BobbaEnvironment.getGame().uiManager.doFurniPlace(selectedId);
    }

    close = () => {
        this.setState({
            visible: false,
        });
    }

    generateGrid(): ReactNode {
        const { selectedId, items, currentType } = this.state;
        const stackableItems: { [id: number]: number } = {};
        const stackableItemsDrawn: { [id: number]: number } = {};
        const displayItems: ReactNode[] = [];
        items.forEach(item => {
            if (stackableItems[item.baseId] == null) {
                stackableItems[item.baseId] = 1;
            } else {
                stackableItems[item.baseId]++;
            }
            stackableItemsDrawn[item.baseId] = 0;
        });

        items.filter(item => (currentType === item.itemType))
            .forEach(item => {
                const count = stackableItems[item.baseId];
                if ((item.stackable && stackableItemsDrawn[item.baseId]++ === 0) || !item.stackable) {
                    if (item.baseItem != null) {
                        const image = canvas2Image(item.baseItem.iconImage);
                        displayItems.push(
                            <button key={item.id} onClick={this.handleSelectItem(item.id)} className={item.id === selectedId ? 'selected' : ''}>
                                <img src={image.src} alt={item.baseItem.furniBase.itemData.name} />
                                {count > 1 ? <span>{count}</span> : <></>}
                            </button>
                        );
                    } else {
                        displayItems.push(
                            <button key={item.id} onClick={this.handleSelectItem(item.id)} className={item.id === selectedId ? 'selected' : ''}>
                                <img src="images/avatar_editor/avatar_editor_download_icon.png" alt={"Loading"} />
                                {count > 1 ? <span>{count}</span> : <></>}
                            </button>
                        );
                    }
                }
            });

        return displayItems;
    }

    generateItemInfo(): ReactNode {
        const { selectedId } = this.state;
        const selectedItem = BobbaEnvironment.getGame().inventory.getItem(selectedId);
        if (selectedItem == null || selectedItem.baseItem == null) {
            return (
                <div className="item_preview">
                    <div className="image_container">
                        <img src={FLOOR_ITEM_PLACEHOLDER} alt="Furni" />
                    </div>
                    <div className="item_data">
                        <h2>
                            Select an item
                        </h2>
                    </div>
                </div>
            );
        }
        const { itemData } = selectedItem.baseItem.furniBase;
        const image = canvas2Image(selectedItem.baseItem.infoImage);
        return (
            <div className="item_preview">
                <div className="image_container">
                    <img src={image.src} alt="Furni" />
                </div>
                <div className="item_data">
                    <h2>
                        {itemData.name}
                    </h2>
                    <p>
                        {itemData.description}
                    </p>
                    <button onClick={this.placeItem}>
                        Place to room
                    </button>
                </div>
            </div>
        );
    }

    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }

    render() {
        const { visible, zIndex } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable defaultClassName="inventory" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.close}>
                        X
                    </button>
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
                            {this.generateSecondTab()}
                        </div>
                        <div className="grid_container">
                            <div className="grid">
                                {this.generateGrid()}
                            </div>
                            {this.generateItemInfo()}
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
    generateSecondTab(): ReactNode {
        const floorSelected = this.state.currentType === ItemType.FloorItem;
        return (
            <>
                <button onClick={this.toggleType(ItemType.FloorItem)} className={floorSelected ? 'selected' : ''}>
                    Floor
                </button>
                <button onClick={this.toggleType(ItemType.WallItem)} className={!floorSelected ? 'selected' : ''}>
                    Wall
                </button>
            </>
        );
    }

    toggleType = (type: ItemType) => () => {
        this.setState({
            currentType: type
        });
    }
}
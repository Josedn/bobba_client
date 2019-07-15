import React, { ReactNode, Fragment } from "react";
import Draggable from "react-draggable";
import './catalogue.css';
import ConfirmPurchase from "./ConfirmPurchase";
import { CatalogueIndex } from "../../bobba/catalogue/Catalogue";
import CataloguePage from "../../bobba/catalogue/CataloguePage";
import BobbaEnvironment from "../../bobba/BobbaEnvironment";
import { canvas2Image } from "../misc/GraphicsUtilities";

type CatalogueProps = {};

type CatalogueState = {
    pages: CatalogueIndex[];
    currentPage?: CataloguePage;
    currentTabId: number;
    currentPageId: number;
    currentItemId: number;
    visible: boolean;
    purchaseWindowVisible: boolean,
};

const initialState = {
    pages: [],
    currentPage: undefined,
    currentPageId: -1,
    currentTabId: -1,
    currentItemId: -1,
    visible: true,
    purchaseWindowVisible: false,
};

export default class Catalogue extends React.Component<CatalogueProps, CatalogueState> {
    constructor(props: CatalogueProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();

        game.uiManager.setOnOpenCatalogueHandler(() => {
            this.setState({
                visible: true,
            });
        });

        game.uiManager.setOnCloseCatalogueHandler(() => {
            this.setState({
                visible: false,
            });
        });

        game.uiManager.setOnLoadCatalogueIndexHandler(index => {
            this.setState({
                pages: index,
                currentPage: undefined,
                currentItemId: -1,
                currentPageId: -1,
                currentTabId: -1,
            });
        });

        game.uiManager.setOnLoadCataloguePageHandler(page => {
            this.setState({
                currentPage: page,
            });
        });
    }

    handleClose = () => {
        this.setState({
            visible: false,
        });
    }

    generateTabs(): ReactNode {
        const { pages, currentPageId, currentTabId } = this.state;

        return pages.map(currentPage => {
            const children = currentPage.children.map(child => {
                return (
                    <button onClick={this.handleChangePage(child.id)} key={child.id} className={"second_tab" + (currentPageId === child.id ? ' selected' : '')}>
                        <div className="icon">
                            <img src={"http://images.bobba.io/c_images/catalogue/icon_" + child.iconId + ".png"} alt={child.name} />
                        </div>
                        <span>{child.name}</span>
                    </button>
                );
            });

            return (
                <Fragment key={currentPage.id}>
                    <button onClick={this.handleChangePage(currentPage.id)} className={"main_tab" + (currentPageId === currentPage.id ? ' selected' : '') + (currentTabId === currentPage.id ? ' open' : '')}>
                        <div className="icon" style={{ backgroundColor: '#' + currentPage.color }}>
                            <img src={"http://images.bobba.io/c_images/catalogue/icon_" + currentPage.iconId + ".png"} alt={currentPage.name} />
                        </div>
                        <span>{currentPage.name}</span>
                    </button>
                    {currentTabId === currentPage.id ? children : <></>}
                </Fragment>
            );
        });
    }

    handleSelectItem = (id: number) => () => {
        this.setState({
            currentItemId: id,
        });
    }

    handleChangePage = (id: number) => () => {
        const { pages, currentTabId } = this.state;
        const isMain = pages.find(value => value.id === id);

        if (isMain) {
            if (isMain.children.length > 0 && currentTabId !== id) {
                this.setState({
                    currentPageId: id,
                    currentTabId: id,
                    currentItemId: -1,
                    purchaseWindowVisible: false,
                });
            } else {
                this.setState({
                    currentPageId: id,
                    currentTabId: -1,
                    currentItemId: -1,
                    purchaseWindowVisible: false,
                });
            }
        } else {
            this.setState({
                currentPageId: id,
                currentItemId: -1,
                purchaseWindowVisible: false,
            });
        }

        BobbaEnvironment.getGame().uiManager.doRequestCataloguePage(id);
    }

    generateDescription(): ReactNode {
        const { currentItemId, currentPage } = this.state;
        if (currentPage == null) {
            return <></>;
        }
        if (currentItemId !== -1) {
            const item = currentPage.items.find(value => value.itemId === currentItemId);
            if (item != null && item.baseItem != null) {
                const image = canvas2Image(item.baseItem.infoImage);
                return (
                    <>
                        <div className="image_container">
                            <img src={image.src} alt={item.baseItem.furniBase.itemData.name} />
                        </div>
                        <div className="description_container">
                            <h2>{item.baseItem.furniBase.itemData.name}</h2>
                            <p>{item.baseItem.furniBase.itemData.description}</p>
                        </div>
                        <div className="button_container">
                            <span>{item.cost} crédito{item.cost === 1 ? '' : 's'}</span>
                            <button onClick={this.handleTryPurchase}>Comprar</button>
                        </div>
                    </>
                );
            } else {
                return <></>;
            }
        }

        return (
            <>
                <div className="image_container">
                    <img src={"http://images.bobba.io/c_images/catalogue/" + currentPage.imageTeaser + ".gif"} alt="Furniture" />
                </div>
                <div className="description_container">
                    {currentPage.textDetails}
                </div>
            </>
        );
    }

    handleTryPurchase = () => {
        this.setState({
            purchaseWindowVisible: true,
        });
    }

    handlePurchase = () => {
        const { currentItemId, currentPageId } = this.state;
        BobbaEnvironment.getGame().uiManager.doRequestCataloguePurchase(currentPageId, currentItemId);
        this.setState({
            purchaseWindowVisible: false,
        });
    }

    handlePurchaseWindowClose = () => {
        this.setState({
            purchaseWindowVisible: false,
        });
    }

    generateGrid(): ReactNode {
        const { currentPage, currentItemId } = this.state;
        if (currentPage == null) {
            return <></>;
        }

        return currentPage.items.map(item => {
            if (item.baseItem == null) {
                return (
                    <button key={item.itemId} onClick={() => { }} className={''}>
                        <img src="images/avatar_editor/avatar_editor_download_icon.png" alt={"Loading"} />
                    </button>
                );
            } else {
                const image = canvas2Image(item.baseItem.iconImage);
                return (
                    <button key={item.itemId} onClick={this.handleSelectItem(item.itemId)} className={currentItemId === item.itemId ? 'selected' : ''}>
                        <img src={image.src} alt={item.baseItem.furniBase.itemData.name} />
                    </button>
                );
            }
        });
    }

    generateFrontPage(currentPage: CataloguePage): ReactNode {
        return (
            <>
                <div className="frontpage_teaser">
                    <img alt="border" src="http://images.bobba.io/c_images/catalogue/front_page_border.gif" className="border" />
                    <img alt="article" src={"http://images.bobba.io/c_images/Top_Story_Images/" + currentPage.imageTeaser + ".gif"} className="top_story" />
                    <h2>
                        {currentPage.textHeader}
                    </h2>
                    <p>
                        {currentPage.textDetails}
                    </p>
                </div>
                <div className="frontpage_content">
                    <h2>{currentPage.textMisc}</h2>
                    <p>{currentPage.textMisc2}</p>
                </div>
                <div className="frontpage_vouchers">
                    <span>Voucher code:</span>
                    <input type="text" name="voucher" />
                    <button>Redeem</button>
                </div>
            </>
        );
    }

    generateDefaultPage(currentPage: CataloguePage): ReactNode {
        return (
            <>
                <div className="description">
                    {currentPage.textHeader}
                </div>
                <div className="second_row">
                    <div className="grid_container">
                        <div className="title">
                            Elige un furni
                            </div>
                        <div className="grid">
                            {this.generateGrid()}
                        </div>
                    </div>
                    <div className="item_description">
                        {this.generateDescription()}
                    </div>
                </div>
            </>
        );
    }

    generatePage(): ReactNode {
        const { currentPage } = this.state;
        if (currentPage != null) {
            let page = null;
            if (currentPage.layout === 'frontpage') {
                page = this.generateFrontPage(currentPage);
            } else {
                page = this.generateDefaultPage(currentPage);
            }
            return (
                <div className="wrapper">
                    <div className="header_container">
                        <img alt="Furniture" src={"http://images.bobba.io/c_images/catalogue/" + currentPage.imageHeadline + ".gif"} />
                    </div>
                    {page}
                </div>
            );
        }
        return <></>;
    }
    render() {
        const { visible, purchaseWindowVisible, currentItemId, currentPage } = this.state;
        if (!visible) {
            return <></>;
        }
        let purchaseWindow = <></>;
        if (currentPage != null && purchaseWindowVisible) {
            const item = currentPage.items.find(value => value.itemId === currentItemId);
            if (item != null && item.baseItem != null) {
                purchaseWindow = <ConfirmPurchase item={item} onClose={this.handlePurchaseWindowClose} onPurchase={this.handlePurchase} />
            }
        }

        return (
            <>
                <Draggable handle=".handle">
                    <div className="catalogue">
                        <div className="content">
                            <div className="handle" />
                            {this.generatePage()}
                        </div>
                        <div className="navigator">
                            <button className="close" onClick={this.handleClose}>
                                X
                            </button>
                            <h2 className="handle">Shop</h2>
                            <hr />
                            <div className="tab_container">
                                {this.generateTabs()}
                            </div>
                        </div>
                    </div>
                </Draggable>
                {purchaseWindow}
            </>
        );
    }
}
import React, { ReactNode, Fragment, RefObject } from "react";
import Draggable from "react-draggable";
import './catalogue.css';
import ConfirmPurchase from "./ConfirmPurchase";
import { CatalogueIndex } from "../../bobba/catalogue/Catalogue";
import CataloguePage from "../../bobba/catalogue/CataloguePage";
import BobbaEnvironment from "../../bobba/BobbaEnvironment";
import { canvas2Image } from "../misc/GraphicsUtilities";
import WindowManager from "../windows/WindowManager";
import CatalogueItem from "../../bobba/catalogue/CatalogueItem";
import Constants from "../../Constants";

type CatalogueProps = {};

type CatalogueState = {
    pages: CatalogueIndex[];
    currentPage?: CataloguePage;
    currentTabId: number;
    currentPageId: number;
    currentItemId: number;
    visible: boolean;
    purchaseWindowVisible: boolean,
    zIndex: number,
};

const initialState = {
    pages: [],
    currentPage: undefined,
    currentPageId: -1,
    currentTabId: -1,
    currentItemId: -1,
    visible: false,
    purchaseWindowVisible: false,
    zIndex: WindowManager.getNextZIndex(),
};

const pageColors = [4293190884, 4293914607, 0xFFFFDB54, 4289454682, 4289431551, 4285716709, 4294016606, 4293326172, 4293694138, 4285383659, 4293082689, 4288782753];

export default class Catalogue extends React.Component<CatalogueProps, CatalogueState> {
    constructor(props: CatalogueProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();

        game.uiManager.onOpenCatalogue = (() => {
            this.setState({
                visible: true,
                zIndex: WindowManager.getNextZIndex()
            });
        });

        game.uiManager.onCloseCatalogue = (() => {
            this.setState({
                visible: false,
            });
        });

        game.uiManager.onLoadCatalogueIndex = (index => {
            this.setState({
                pages: index,
                currentPage: undefined,
                currentItemId: -1,
                currentPageId: -1,
                currentTabId: -1,
            });
        });

        game.uiManager.onLoadCataloguePage = (page => {
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
                            <img src={Constants.CATALOGUE_RESOURCES_URL + "icon_" + child.iconId + ".png"} alt={child.name} />
                        </div>
                        <span>{child.name}</span>
                    </button>
                );
            });

            const calculatedColor = pageColors[currentPage.color % pageColors.length].toString(16).substr(2);

            return (
                <Fragment key={currentPage.id}>
                    <button onClick={this.handleChangePage(currentPage.id)} className={"main_tab" + (currentPageId === currentPage.id ? ' selected' : '') + (currentTabId === currentPage.id ? ' open' : '')}>
                        <div className="icon" style={{ backgroundColor: '#' + calculatedColor }}>
                            <img src={Constants.CATALOGUE_RESOURCES_URL + "icon_" + currentPage.iconId + ".png"} alt={currentPage.name} />
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
                    {currentPage.imageTeaser.length > 0 ? <img src={Constants.CATALOGUE_RESOURCES_URL + "" + currentPage.imageTeaser + ".gif"} alt="Furniture" /> : <></>}
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

    generateFurniButton(item: CatalogueItem): ReactNode {
        const { currentItemId } = this.state;
        const ref: RefObject<HTMLImageElement> = React.createRef();

        item.loadBase().then(base => {
            const image = canvas2Image(base.iconImage);
            const renderedImg = ref.current;
            if (renderedImg != null) {
                renderedImg.src = image.src;
                renderedImg.alt = base.furniBase.itemData.name;
            }
        }).catch(err => {
            
        });

        return (
            <button key={item.itemId} onClick={this.handleSelectItem(item.itemId)} className={currentItemId === item.itemId ? 'selected' : ''}>
                <img ref={ref} src="images/avatar_editor/avatar_editor_download_icon.png" alt={"Loading"} />
            </button>
        );
    }

    generateGrid(): ReactNode {
        const { currentPage } = this.state;
        if (currentPage == null) {
            return <></>;
        }

        return currentPage.items.map(item => this.generateFurniButton(item));
    }

    generateFrontPage(currentPage: CataloguePage): ReactNode {
        return (
            <>
                <div className="frontpage_teaser">
                    <img alt="border" src={Constants.CATALOGUE_RESOURCES_URL + "front_page_border.gif"} className="border" />
                    <img alt="article" src={Constants.TOP_STORY_RESOURCES_URL + currentPage.imageTeaser + ".gif"} className="top_story" />
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
                            Pick a furni
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
                        {currentPage.imageHeadline.length > 0 ? <img alt="Furniture" src={Constants.CATALOGUE_RESOURCES_URL + "" + currentPage.imageHeadline + ".gif"} /> : <></>}
                    </div>
                    {page}
                </div>
            );
        }
        return <></>;
    }
    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }
    render() {
        const { visible, purchaseWindowVisible, currentItemId, currentPage, zIndex } = this.state;
        if (!visible) {
            return <></>;
        }
        let purchaseWindow = <></>;
        if (currentPage != null && purchaseWindowVisible) {
            const item = currentPage.items.find(value => value.itemId === currentItemId);
            if (item != null && item.baseItem != null) {
                purchaseWindow = <ConfirmPurchase zIndex={WindowManager.getNextZIndex()} item={item} onClose={this.handlePurchaseWindowClose} onPurchase={this.handlePurchase} />
            }
        }

        return (
            <>
                <Draggable handle=".handle" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                    <div className="catalogue" style={{ zIndex }}>
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
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
};

const initialState = {
    pages: [],
    currentPage: undefined,
    currentPageId: -1,
    currentTabId: -1,
    currentItemId: -1,
    visible: true,
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

    handleChangePage = (id: number) => () => {
        const { pages, currentTabId } = this.state;
        const isMain = pages.find(value => value.id === id);

        if (isMain) {
            if (isMain.children.length > 0 && currentTabId !== id) {
                this.setState({
                    currentPageId: id,
                    currentTabId: id,
                });
            } else {
                this.setState({
                    currentPageId: id,
                    currentTabId: -1,
                });
            }
        } else {
            this.setState({
                currentPageId: id,
            });
        }

        BobbaEnvironment.getGame().uiManager.doRequestCataloguePage(id);
    }

    generateDescription(): ReactNode {
        const { currentItemId, currentPage } = this.state;
        if (currentPage == null) {
            return <></>;
        }
        if (currentItemId === -1) {
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

        return (
            <>
                <div className="image_container">
                    <img src="data:image/png;base64,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" alt="Causantes" />
                </div>
                <div className="description_container">
                    Los efectos tienen lugar cuando cambia el estado de un Furni mediante un doble clic.
                </div>
                <div className="button_container">
                    <span>3 créditos</span>
                    <button>Comprar</button>
                </div>
            </>
        );
    }

    generateGrid(): ReactNode {
        const { currentPage } = this.state;
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
                    <button key={item.itemId} onClick={() => { }} className={''}>
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
        const { visible } = this.state;
        if (!visible) {
            return <ConfirmPurchase />;
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
            </>
        );
    }
}
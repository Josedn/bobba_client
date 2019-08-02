import CataloguePage from "./CataloguePage";
import BobbaEnvironment from "../BobbaEnvironment";
import RequestCataloguePage from "../communication/outgoing/catalogue/RequestCataloguePage";
import RequestCataloguePurchase from "../communication/outgoing/catalogue/RequestCataloguePurchase";

export type CatalogueIndex = {
    id: number;
    name: string;
    iconId: number;
    color: number;
    visible: boolean,
    children: CatalogueIndex[];
};

export default class Catalogue {
    catalogueIndex: CatalogueIndex[];
    pages: { [id: number]: CataloguePage };

    constructor() {
        this.catalogueIndex = [];
        this.pages = {};
    }

    setIndex(index: CatalogueIndex[]) {
        this.catalogueIndex = index;
        BobbaEnvironment.getGame().uiManager.onLoadCatalogueIndex(index);
        if (index.length > 0) {
            this.requestPage(index[0].id);
        }
    }

    setCataloguePage(page: CataloguePage) {
        this.pages[page.id] = page;
        BobbaEnvironment.getGame().uiManager.onLoadCataloguePage(page);
    }

    getPage(pageId: number) {
        return this.pages[pageId];
    }

    requestPage(pageId: number) {
        const cachedPage = this.getPage(pageId);
        if (cachedPage == null) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestCataloguePage(pageId));
        } else {
            BobbaEnvironment.getGame().uiManager.onLoadCataloguePage(cachedPage);
        }
    }

    requestPurchase(pageId: number, itemId: number) {
        BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestCataloguePurchase(pageId, itemId));
    }
}

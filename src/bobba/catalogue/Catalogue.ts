import CataloguePage from "./CataloguePage";

export type CatalogueIndex = {
    id: number;
    name: string;
    iconId: number;
    color: string;
    visible: boolean,
    children: CatalogueIndex[];
};

export default class Catalogue {
    catalogueIndex: CatalogueIndex[];
    constructor() {
        this.catalogueIndex = [];
    }

    setIndex(index: CatalogueIndex[]) {
        this.catalogueIndex = index;
    }

    setCataloguePage(page: CataloguePage) {
        
    }
}

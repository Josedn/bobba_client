import CatalogueItem from "./CatalogueItem";

export default class CataloguePage {
    id: number;
    layout: string;
    imageHeadline: string;
    imageTeaser: string;
    textHeader: string;
    textDetails: string;
    textMisc: string;
    textMisc2: string;
    items: CatalogueItem[];

    constructor(id: number, layout: string, imageHeadline: string, imageTeaser: string, textHeader: string, textDetails: string, textMisc: string, textMisc2: string, items: CatalogueItem[]) {
        this.id = id;
        this.layout = layout;
        this.imageHeadline = imageHeadline;
        this.imageTeaser = imageTeaser;
        this.textHeader = textHeader;
        this.textDetails = textDetails;
        this.textMisc = textMisc;
        this.textMisc2 = textMisc2;
        this.items = items;
    }
}
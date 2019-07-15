import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_CATALOGUE_PAGE } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestCataloguePage extends ClientMessage {
    constructor(pageId: number) {
        super(REQUEST_CATALOGUE_PAGE);
        this.appendInt(pageId);
    }
}
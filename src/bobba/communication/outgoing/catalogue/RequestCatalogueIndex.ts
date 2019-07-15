import ClientMessage from "../../protocol/ClientMessage";
import { REQUEST_CATALOGUE_INDEX } from "../../protocol/OpCodes/ClientOpCodes";

export default class RequestCatalogueIndex extends ClientMessage {
    constructor() {
        super(REQUEST_CATALOGUE_INDEX);
    }
}
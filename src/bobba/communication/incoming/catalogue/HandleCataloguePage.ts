import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import { ItemType } from "../../../imagers/furniture/FurniImager";
import CatalogueItem from "../../../catalogue/CatalogueItem";
import CataloguePage from "../../../catalogue/CataloguePage";

export default class HandleCataloguePage implements IIncomingEvent {
    handle(request: ServerMessage) {
        const pageId = request.popInt();
        const layout = request.popString();
        const imageHeadline = request.popString();
        const imageTeaser = request.popString();
        const textHeader = request.popString();
        const textDetails = request.popString();
        const textMisc = request.popString();
        const textMisc2 = request.popString();

        const itemCount = request.popInt();

        const items: CatalogueItem[] = [];

        for (let i = 0; i < itemCount; i++) {
            const itemId = request.popInt();
            const itemName = request.popString();
            const cost = request.popInt();
            const itemType = request.popString() === 'F' ? ItemType.FloorItem : ItemType.WallItem;
            const baseId = request.popInt();
            const amount = request.popInt();
            items.push(new CatalogueItem(itemId, itemName, cost, itemType, baseId, amount));
        }

        const page = new CataloguePage(pageId, layout, imageHeadline, imageTeaser, textHeader, textDetails, textMisc, textMisc2, items);
        BobbaEnvironment.getGame().catalogue.setCataloguePage(page);
    }
}

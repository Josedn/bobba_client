import IIncomingEvent from "../IIncomingEvent";
import ServerMessage from "../../protocol/ServerMessage";
import BobbaEnvironment from "../../../BobbaEnvironment";
import { CatalogueIndex } from "../../../catalogue/Catalogue";

export default class HandleCatalogueIndex implements IIncomingEvent {
    handle(request: ServerMessage) {
        const mainTreeSize = request.popInt();
        const pages: CatalogueIndex[] = [];
        for (let i = 0; i < mainTreeSize; i++) {
            pages.push(this.extractPage(request));
        }

        BobbaEnvironment.getGame().catalogue.setIndex(pages);
    }

    extractPage(request: ServerMessage): CatalogueIndex {
        const visible = request.popBoolean();
        const color = request.popInt();
        const iconId = request.popInt();
        const id = request.popInt();
        const name = request.popString();
        const childrenCount = request.popInt();
        const children: CatalogueIndex[] = [];

        for (let i = 0; i < childrenCount; i++) {
            children.push(this.extractPage(request));
        }

        return {
            id,
            name,
            iconId,
            color,
            visible,
            children,
        }
    }
}

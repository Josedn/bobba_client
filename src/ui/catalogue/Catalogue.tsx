import React from "react";
import Draggable from "react-draggable";
import './catalogue.css';

type CatalogueProps = {};
type CatalogueState = {};
const initialState = {};
export default class Catalogue extends React.Component<CatalogueProps, CatalogueState> {
    constructor(props: CatalogueProps) {
        super(props);
        this.state = initialState;
    }
    render() {
        return (
            <Draggable>
                <div className="catalogue">
                    Shop
                </div>
            </Draggable>
        );
    }
}
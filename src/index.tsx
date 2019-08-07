/*
import FurniImager, { ItemType } from './bobba/imagers/furniture/FurniImager';
const furniImager = new FurniImager();

furniImager.initialize().then(() => {
  furniImager.loadItemBase(ItemType.FloorItem, 4655, 64).then(base => {
    
  });

});
*/


import React from 'react';
import { hydrate, render } from "react-dom";
import BobbaUI from './ui/BobbaUI';

const rootElement = document.getElementById("root");
if (rootElement != null && rootElement.hasChildNodes()) {
  hydrate(<BobbaUI />, rootElement);
} else {
  render(<BobbaUI />, rootElement);
}

import { Atlas } from "./Atlas";

//assets
export type FurniOffsetAsset = {
    name: string,
    exists: boolean,
    x: number,
    y: number,
    flipH?: number,
    source?: string,
};

export type FurniOffsetAssetDictionary = {
    [id: string]: FurniOffsetAsset;
};

//logic
export type FurniOffsetLogic = {
    dimensions: { x: number, y: number, z: number },
    directions: number[],
};

//export type FurniOffsetLogicType = "furniture_multistate" | "furniture_basic" | "furniture_animated";

//index
export type FurniOffsetIndex = {
    type: string,
    visualization: string,
    logic: string,
};

//visualization
export type FurniOffsetVisualizationColorData = {
    layerId: number,
    color: string,
};
export type FurniOffsetVisualizationColor = {
    [colorId: string]: FurniOffsetVisualizationColorData[],
};
export type FurniOffsetVisualizationLayerData = {
    layerId: number,
    ink?: string,
    alpha?: number,
    ignoreMouse?: number,
    z?: number,
};
export type FurniOffsetAnimationLayer = {
    layerId: number,
    frameSequence: number[][],
};
export type FurniOffsetVisualizationAnimation = {
    id: number,
    transitionTo?: number,
    layers: FurniOffsetAnimationLayer[],
};
export type FurniOffsetVisualizationData = {
    angle: number,
    layerCount: number,
    size: number,
    directions: { [directionId: number]: FurniOffsetVisualizationLayerData[] },
    layers?: FurniOffsetVisualizationLayerData[],
    colors?: FurniOffsetVisualizationColor,
    animations?: { [animationId: number]: FurniOffsetVisualizationAnimation },
};
export type FurniOffsetVisualization = {
    1: FurniOffsetVisualizationData,
    32?: FurniOffsetVisualizationData,
    64: FurniOffsetVisualizationData,
};

//furni.json
export type FurniOffset = {
    assets: FurniOffsetAssetDictionary;
    visualization: FurniOffsetVisualization;
    logic: FurniOffsetLogic;
    index: FurniOffsetIndex;
    atlas: Atlas;
};

//assets
export type FurniOffsetAsset = {
    name: string,
    flipH?: string,
    source?: string,
    x: string,
    y: string,
};

export type FurniOffsetAssetDictionary = {
    [id: string]: FurniOffsetAsset;
};

//misc
export type FurniOffsetType = "furniture_multistate" | "furniture_basic" | "furniture_animated";

//logic

export type FurniOffsetLogic = {
    dimensions: { x: string, y: string, z: string },
    directions: string[],
    type: FurniOffsetType,
};

//visualization
export type FurniOffsetVisualizationColorData = {
    layerId: string,
    color: string,
};
export type FurniOffsetVisualizationColor = {
    [colorId: string]: FurniOffsetVisualizationColorData[],
};
export type FurniOffsetVisualizationLayerData = {
    id: string,
    ink?: string,
    alpha?: string,
    ignoreMouse?: string,
    z?: string,
};
export type FurniOffsetVisualizationLayerOverrideData = {
    layerId: string,
    ink?: string,
    ignoreMouse?: string,
    z?: string,
};
export type FurniOffsetVisualizationAnimation = {
    id: string,
    transitionTo?: string,
    layers: {
        layerId: string,
        frameSequence: string[],
    }[],
};
export type FurniOffsetVisualizationData = {
    angle: string,
    layerCount: string,
    size: string,
    directions: { [directionId: string]: FurniOffsetVisualizationLayerOverrideData[] },
    layers: FurniOffsetVisualizationLayerData[],
    colors?: FurniOffsetVisualizationColor,
    animations?: { [animationId: string]: FurniOffsetVisualizationAnimation },
};
export type FurniOffsetVisualization = {
    type: FurniOffsetType,
    1: FurniOffsetVisualizationData,
    32: FurniOffsetVisualizationData,
    64: FurniOffsetVisualizationData,
};

//furni.json
export type FurniOffset = {
    type: string;
    assets: FurniOffsetAssetDictionary;
    visualization: FurniOffsetVisualization;
    logic: FurniOffsetLogic;
};
//assets
export type FurniOffsetAsset = {
    name: string,
    flipH?: string,
    source?: string,
    x: number,
    y: number,
};

export type FurniOffsetAssetDictionary = {
    [id: string]: FurniOffsetAsset;
};

//misc
export type FurniOffsetType = "furniture_multistate" | "furniture_basic" | "furniture_animated";

//logic

export type FurniOffsetLogic = {
    dimensions: { x: string, y: string, z: string },
    directions: number[],
    type: FurniOffsetType,
};

//visualization
export type FurniOffsetVisualizationColorData = {
    layerId: number,
    color: string,
};
export type FurniOffsetVisualizationColor = {
    [colorId: number]: FurniOffsetVisualizationColorData[],
};
export type FurniOffsetVisualizationLayerData = {
    id: number,
    ink?: string,
    ignoreMouse?: number,
    z?: number,
};
export type FurniOffsetVisualizationLayerOverrideData = {
    layerId: number,
    ink?: string,
    ignoreMouse?: number,
    z?: number,
};
export type FurniOffsetVisualizationAnimation = {
    id: number,
    transitionTo?: number,
    layers: {
        layerId: number,
        frameSequence: number[],
    }[],
};
export type FurniOffsetVisualizationData = {
    angle: number,
    layerCount: number,
    size: number,
    directions: { [directionId: number]: FurniOffsetVisualizationLayerOverrideData[] },
    layers: FurniOffsetVisualizationLayerData[],
    colors?: FurniOffsetVisualizationColor,
    animations?: { [animationId: number]: FurniOffsetVisualizationAnimation },
};
export type FurniOffsetVisualization = {
    type: FurniOffsetType,
    1: FurniOffsetVisualizationData,
    32: FurniOffsetVisualizationData,
    64: FurniOffsetVisualizationData,
};

//furni.json
export type FurniOffset = {
    type: string,
    assets: FurniOffsetAssetDictionary,
    visualization: FurniOffsetVisualization,
    logic: FurniOffsetLogic,
};
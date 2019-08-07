import * as parser from 'fast-xml-parser';

//assets
export type FurniOffsetAsset = {
    name: string,
    flipH?: number,
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
    dimensions: { x: number, y: number, z: number },
    directions: number[],
    //type: FurniOffsetType,
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
    //type: FurniOffsetType,
    1: FurniOffsetVisualizationData,
    32: FurniOffsetVisualizationData,
    64: FurniOffsetVisualizationData,
};

//furni.json
export type FurniOffset = {
    //type: string;
    assets: FurniOffsetAssetDictionary;
    visualization: FurniOffsetVisualization;
    logic: FurniOffsetLogic;
};

const parseXml = (xmlData: string): any => {
    const options = {
        attributeNamePrefix: "",
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: true,
        parseAttributeValue: true,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        localeRange: "", //To support non english character in tag/attribute values.
        parseTrueNumberOnly: false,
    };

    if (parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
        const jsonObj = parser.parse(xmlData, options);
        return jsonObj;
    }

    return null;
};

const generateAssetsFromXml = (rawXml: string): FurniOffsetAssetDictionary | null => {
    const parsed = parseXml(rawXml);
    const assetDictionary: FurniOffsetAssetDictionary = {};

    if (parsed != null) {
        const assets = parsed.assets.asset as any[];
        assets.forEach(rawAsset => {
            const data: FurniOffsetAsset = {
                name: rawAsset.name,
                flipH: rawAsset.flipH,
                source: rawAsset.source,
                x: rawAsset.x,
                y: rawAsset.y
            };

            assetDictionary[data.name] = data;
        });

        return assetDictionary;
    }
    return null;
};

const generateLogicFromXml = (rawXml: string): FurniOffsetLogic | null => {
    const parsed = parseXml(rawXml);
    if (parsed != null) {
        const rawLogic = parsed.objectData;
        const rawDirections = rawLogic.model.directions.direction as any[];
        const directions = rawDirections.map(rawDir => {
            return rawDir.id as number;
        });
        const logic: FurniOffsetLogic = {
            //type: rawLogic.type,
            dimensions: {
                x: rawLogic.model.dimensions.x,
                y: rawLogic.model.dimensions.y,
                z: rawLogic.model.dimensions.z,
            },
            directions
        };
        return logic;
    }
    return null;
};

const parseXmlArray = (data: any): any[] => {
    if (data instanceof Array) {
        return data;
    }
    return [data];
};

const generateVisualizationFromXml = (rawXml: string): FurniOffsetVisualization | null => {
    const parsed = parseXml(rawXml);
    if (parsed != null) {
        const rawVisualization = parsed.visualizationData.graphics.visualization as any[];
        const parsedVisualizations = rawVisualization.map(rawVisualizationData => {
            const visualizationData: FurniOffsetVisualizationData = {
                angle: rawVisualizationData.angle,
                layerCount: rawVisualizationData.layerCount,
                size: rawVisualizationData.size,
                directions: {},
                //layers: [],
                //animations: {},
                //colors: {},
            };

            if (rawVisualizationData.directions != null && rawVisualizationData.directions.direction != null) {
                const rawDirections = parseXmlArray(rawVisualizationData.directions.direction);
                rawDirections.forEach(direction => {
                    visualizationData.directions[direction.id] = [];
                });
            }

            if (rawVisualizationData.colors != null && rawVisualizationData.colors.color != null) {
                const rawColors = parseXmlArray(rawVisualizationData.colors.color);
                const allegedColors: FurniOffsetVisualizationColor = {};
                rawColors.forEach(color => {
                    allegedColors[color.id] = [];
                    const colorLayers = parseXmlArray(color.colorLayer);
                    colorLayers.forEach(rawColorLayer => {
                        allegedColors[color.id].push({
                            layerId: rawColorLayer.id,
                            color: rawColorLayer.color,
                        });
                    });
                });
                visualizationData.colors = allegedColors;
            }

            if (rawVisualizationData.animations != null && rawVisualizationData.animations.animation != null) {
                const rawAnimations = parseXmlArray(rawVisualizationData.animations.animation);
                const allegedAnimations: { [animationId: string]: FurniOffsetVisualizationAnimation } = {};

                rawAnimations.forEach(animation => {
                    const animationLayers = parseXmlArray(animation.animationLayer);
                    const layers: FurniOffsetAnimationLayer[] = [];

                    animationLayers.forEach(animationLayer => {
                        const rawFrameSequences = parseXmlArray(animationLayer.frameSequence);
                        const frameSequence = rawFrameSequences.map(rawFrameSequence => {
                            const actualSequences = parseXmlArray(rawFrameSequence.frame);
                            return actualSequences.map(layer => {
                                return layer.id as number;
                            });
                        });

                        layers.push({
                            layerId: animationLayer.id,
                            frameSequence,
                        });
                    });

                    allegedAnimations[animation.id] = {
                        id: animation.id,
                        layers,
                    };
                });

                visualizationData.animations = allegedAnimations;
            }

            if (rawVisualizationData.layers != null && rawVisualizationData.layers.layer != null) {
                const rawLayers = parseXmlArray(rawVisualizationData.layers.layer);
                const allegedLayers: FurniOffsetVisualizationLayerData[] = [];
                rawLayers.forEach(rawLayer => {
                    allegedLayers.push({
                        layerId: rawLayer.id,
                        ink: rawLayer.ink,
                        alpha: rawLayer.alpha,
                        ignoreMouse: rawLayer.ignoreMouse,
                        z: rawLayer.z
                    });
                });
                visualizationData.layers = allegedLayers;
            }

            return visualizationData;
        });

        const icon = parsedVisualizations.find(value => value.size === 1);
        const small = parsedVisualizations.find(value => value.size === 32);
        const large = parsedVisualizations.find(value => value.size === 64);
        if (icon != null && small != null && large != null) {
            return {
                1: icon,
                32: small,
                64: large,
            }
        }
    }
    return null;
};

export const generateOffsetFromXml = (assetsXml: string, logicXml: string, visualizationXml: string): FurniOffset | null => {
    const assets = generateAssetsFromXml(assetsXml);
    const logic = generateLogicFromXml(logicXml);
    const visualization = generateVisualizationFromXml(visualizationXml);
    if (assets != null && logic != null && visualization != null) {
        return {
            assets,
            logic,
            visualization,
        };
    }
    return null;
};
import { Texture } from 'pixi.js-legacy';
import BobbaEnvironment from "../../BobbaEnvironment";
import { flipImage } from "../furniture/FurniBase";

export default class RoomImager {
    roomTileTexture?: Texture;
    roomStairLTexture?: Texture;
    roomStairRTexture?: Texture;
    initialize() {
        this.roomTileTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateFloorTile(7));
        this.roomStairLTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateStairL());
        const stairRCanvas = this.generateStairR();
        if (stairRCanvas != null) {
            this.roomStairRTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(stairRCanvas);
        }
    }

    generateRoomWallL(z: number): Texture {
        return BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateWallL(122 + (z * 32)));
    }

    generateRoomWallR(z: number): Texture {
        return BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateWallR(122 + (z * 32)));
    }

    generateRoomDoorL(): Texture {
        return BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateWallL(28));
    }

    generateRoomDoorBeforeL(z: number): Texture {
        return BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateWallBeforeDoorL(122 + (z * 32)));
    }

    generateStairL(): HTMLCanvasElement {
        return this.generateStair('rgba(142,142,94,127)', '#989865', '#7A7A51', '#838357', '#676744', '#6F6F49', false);
    }

    generateStairR(): HTMLCanvasElement | null {
        return flipImage(this.generateStair('rgba(142,142,94,127)', '#989865', '#676744', '#6F6F49', '#7A7A51', '#838357', true));
    }

    generateStair(strokeColor: string, floorColor: string, leftColorStroke: string, leftColor: string, rightColorStroke: string, rightColor: string, rightSide: boolean): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");

        tempCanvas.width = 99;
        tempCanvas.height = 88;

        if (ctx != null) {

            const topFloorPoints = [
                {
                    x: 32,
                    y: 0
                },
                {
                    x: 0,
                    y: 16
                },
                {
                    x: 24,
                    y: 28
                },
                {
                    x: 56,
                    y: 12
                }
            ];

            const stairPoints = [
                {
                    x: 32,
                    y: 0
                },
                {
                    x: 0,
                    y: 16
                },
                {
                    x: 8 + 2,
                    y: 20 + 1
                },
                {
                    x: 40 + 2,
                    y: 4 + 1
                }
            ];

            ctx.strokeStyle = strokeColor;
            ctx.fillStyle = floorColor;
            ctx.beginPath();
            ctx.moveTo(topFloorPoints[0].x, topFloorPoints[0].y);
            ctx.lineTo(topFloorPoints[1].x, topFloorPoints[1].y);
            ctx.lineTo(topFloorPoints[2].x, topFloorPoints[2].y);
            ctx.lineTo(topFloorPoints[3].x, topFloorPoints[3].y);
            ctx.lineTo(topFloorPoints[0].x, topFloorPoints[0].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            const thickness = 7;

            //thickness l
            ctx.strokeStyle = leftColorStroke;
            ctx.fillStyle = leftColor;
            ctx.beginPath();
            ctx.moveTo(topFloorPoints[1].x - 0.5, topFloorPoints[1].y);
            ctx.lineTo(topFloorPoints[1].x - 0.5, topFloorPoints[1].y + thickness);
            ctx.lineTo(topFloorPoints[2].x - 0.5, topFloorPoints[2].y + thickness);
            ctx.lineTo(topFloorPoints[2].x - 0.5, topFloorPoints[2].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            //thickness r
            ctx.strokeStyle = rightColorStroke;
            ctx.fillStyle = rightColor;
            ctx.beginPath();
            ctx.moveTo(topFloorPoints[3].x + 0.5, topFloorPoints[3].y);
            ctx.lineTo(topFloorPoints[3].x + 0.5, topFloorPoints[3].y + thickness);
            ctx.lineTo(topFloorPoints[2].x + 0.5, topFloorPoints[2].y + thickness);
            ctx.lineTo(topFloorPoints[2].x + 0.5, topFloorPoints[2].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            for (let i = 3; i >= 0; i--) {
                let offsetX = (10 * i) + 26;
                let offsetY = (13 * i) + 19;
                let fixedThickness = thickness;
                if (rightSide) {
                    if (i === 1) {
                        fixedThickness += 2;
                    }
                    if (i === 3 || i === 2) {
                        offsetY += 1;
                    }
                }
                ctx.strokeStyle = strokeColor;
                ctx.fillStyle = floorColor;
                ctx.beginPath();
                ctx.moveTo(stairPoints[0].x + offsetX, stairPoints[0].y + offsetY);
                ctx.lineTo(stairPoints[1].x + offsetX, stairPoints[1].y + offsetY);
                ctx.lineTo(stairPoints[2].x + offsetX, stairPoints[2].y + offsetY);
                ctx.lineTo(stairPoints[3].x + offsetX, stairPoints[3].y + offsetY);
                ctx.lineTo(stairPoints[0].x + offsetX, stairPoints[0].y + offsetY);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();

                //thickness l
                ctx.strokeStyle = leftColorStroke;
                ctx.fillStyle = leftColor;
                ctx.beginPath();
                ctx.moveTo(stairPoints[1].x - 0.5 + offsetX, stairPoints[1].y + offsetY);
                ctx.lineTo(stairPoints[1].x - 0.5 + offsetX, stairPoints[1].y + fixedThickness + offsetY);
                ctx.lineTo(stairPoints[2].x - 0.5 + offsetX, stairPoints[2].y + fixedThickness + offsetY);
                ctx.lineTo(stairPoints[2].x - 0.5 + offsetX, stairPoints[2].y + offsetY);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();

                //thickness r
                ctx.strokeStyle = rightColorStroke;
                ctx.fillStyle = rightColor;
                ctx.beginPath();
                ctx.moveTo(stairPoints[3].x + 0.5 + offsetX, stairPoints[3].y + offsetY);
                ctx.lineTo(stairPoints[3].x + 0.5 + offsetX, stairPoints[3].y + fixedThickness + offsetY);
                ctx.lineTo(stairPoints[2].x + 0.5 + offsetX, stairPoints[2].y + fixedThickness + offsetY);
                ctx.lineTo(stairPoints[2].x + 0.5 + offsetX, stairPoints[2].y + offsetY);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }

        }

        return tempCanvas;
    }
    generateFloorTile(thickness: number): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");

        const TILE_H = 32;
        const TILE_W = 64;

        tempCanvas.width = 64;
        tempCanvas.height = 39;

        if (ctx != null) {
            const startX = 32;
            const startY = 0;

            const points = [
                {
                    x: startX,
                    y: startY
                },
                {
                    x: startX - TILE_W / 2,
                    y: startY + TILE_H / 2
                },
                {
                    x: startX,
                    y: startY + TILE_H
                },
                {
                    x: startX + TILE_W / 2,
                    y: startY + TILE_H / 2
                }
            ];

            ctx.strokeStyle = 'rgba(142,142,94,127)';
            ctx.fillStyle = '#989865';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.lineTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            if (thickness > 0) {

                ctx.strokeStyle = '#7A7A51';
                ctx.fillStyle = '#838357';
                ctx.beginPath();
                ctx.moveTo(points[1].x - 0.5, points[1].y);
                ctx.lineTo(points[1].x - 0.5, points[1].y + thickness);
                ctx.lineTo(points[2].x - 0.5, points[2].y + thickness);
                ctx.lineTo(points[2].x - 0.5, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();


                ctx.strokeStyle = '#676744';
                ctx.fillStyle = '#6F6F49';
                ctx.beginPath();
                ctx.moveTo(points[3].x + 0.5, points[3].y);
                ctx.lineTo(points[3].x + 0.5, points[3].y + thickness);
                ctx.lineTo(points[2].x + 0.5, points[2].y + thickness);
                ctx.lineTo(points[2].x + 0.5, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }

        return tempCanvas;
    }
    generateWallBeforeDoorL(height: number) {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");

        tempCanvas.width = 40;
        tempCanvas.height = 24 + height;

        if (ctx != null) {

            const points = [
                {
                    x: 32,
                    y: 0
                },
                {
                    x: 0,
                    y: 16
                },
                {
                    x: 8,
                    y: 20
                },
                {
                    x: 40,
                    y: 4
                }
            ];

            ctx.strokeStyle = '#6f717a';
            ctx.fillStyle = '#70727a';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.lineTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();


            if (height > 0) {

                ctx.strokeStyle = '#90929e';
                ctx.fillStyle = '#90929e';
                ctx.beginPath();
                ctx.moveTo(points[3].x, points[3].y);
                ctx.lineTo(points[3].x, points[3].y + height);
                ctx.lineTo(points[2].x, points[2].y + height);
                ctx.lineTo(points[2].x, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }

        return tempCanvas;
    }

    generateWallR(height: number) {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");

        tempCanvas.width = 40;
        tempCanvas.height = 24 + height;

        if (ctx != null) {

            const points = [
                {
                    x: 8,
                    y: 0
                },
                {
                    x: 40,
                    y: 16
                },
                {
                    x: 32,
                    y: 20
                },
                {
                    x: 0,
                    y: 4
                }
            ];

            ctx.strokeStyle = '#70727a';
            ctx.fillStyle = '#70727a';
            ctx.beginPath();
            ctx.moveTo(points[0].x - 0.5, points[0].y);
            ctx.lineTo(points[1].x - 0.5, points[1].y);
            ctx.lineTo(points[2].x - 0.5, points[2].y);
            ctx.lineTo(points[3].x - 0.5, points[3].y);
            ctx.lineTo(points[0].x - 0.5, points[0].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();


            if (height > 0) {
                ctx.strokeStyle = '#90929e';
                ctx.fillStyle = '#90929e';
                ctx.beginPath();
                ctx.moveTo(points[1].x - 0.5, points[1].y);
                ctx.lineTo(points[1].x - 0.5, points[1].y + height);
                ctx.lineTo(points[2].x - 0.5, points[2].y + height);
                ctx.lineTo(points[2].x - 0.5, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();

                ctx.strokeStyle = '#b6b9c8';
                ctx.fillStyle = '#b6b9c8';
                ctx.beginPath();
                ctx.moveTo(points[3].x, points[3].y);
                ctx.lineTo(points[3].x, points[3].y + height);
                ctx.lineTo(points[2].x, points[2].y + height);
                ctx.lineTo(points[2].x, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }

        }

        return tempCanvas;
    }

    generateWallL(height: number) {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext("2d");

        tempCanvas.width = 40;
        tempCanvas.height = 24 + height;

        if (ctx != null) {

            const points = [
                {
                    x: 32,
                    y: 0
                },
                {
                    x: 0,
                    y: 16
                },
                {
                    x: 8,
                    y: 20
                },
                {
                    x: 40,
                    y: 4
                }
            ];

            ctx.strokeStyle = '#70727a';
            ctx.fillStyle = '#70727a';
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.lineTo(points[1].x, points[1].y);
            ctx.lineTo(points[2].x, points[2].y);
            ctx.lineTo(points[3].x, points[3].y);
            ctx.lineTo(points[0].x, points[0].y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();


            if (height > 0) {
                ctx.strokeStyle = '#bbbecd';
                ctx.fillStyle = '#bbbecd';
                ctx.beginPath();
                ctx.moveTo(points[1].x - 0.5, points[1].y);
                ctx.lineTo(points[1].x - 0.5, points[1].y + height);
                ctx.lineTo(points[2].x - 0.5, points[2].y + height);
                ctx.lineTo(points[2].x - 0.5, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();


                ctx.strokeStyle = '#90929e';
                ctx.fillStyle = '#90929e';
                ctx.beginPath();
                ctx.moveTo(points[3].x, points[3].y);
                ctx.lineTo(points[3].x, points[3].y + height);
                ctx.lineTo(points[2].x, points[2].y + height);
                ctx.lineTo(points[2].x, points[2].y);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }

        return tempCanvas;
    }
}
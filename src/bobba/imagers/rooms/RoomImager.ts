import { Texture } from "pixi.js";
import BobbaEnvironment from "../../BobbaEnvironment";

export default class RoomImager {
    roomTileTexture?: Texture;
    initialize() {
        this.roomTileTexture = BobbaEnvironment.getGame().engine.getTextureFromImage(this.generateFloorTile(7));
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

            ctx.strokeStyle = '#6f717a';
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
                ctx.strokeStyle = '#9597a3';
                ctx.fillStyle = '#9597a3';
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
}
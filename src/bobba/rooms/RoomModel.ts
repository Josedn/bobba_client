export default class RoomModel {
    maxX: number;
    maxY: number;
    doorX: number;
    doorY: number;
    heightMap: number[][];

    constructor(maxX: number, maxY: number, doorX: number, doorY: number, heightMap: number[][]) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.doorX = doorX;
        this.doorY = doorY;
        this.heightMap = heightMap;
    }
    
    isValidTile(x: number, y: number): boolean {
        return (x >= 0 && x < this.maxX && y >= 0 && y < this.maxY && this.heightMap[x][y] !== 0);
    }
}
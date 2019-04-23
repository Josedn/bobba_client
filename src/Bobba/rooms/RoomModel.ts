export default class RoomModel {
    maxX: number;
    maxY: number;
    doorX: number;
    doorY: number;
    doorZ: number;
    doorRot: number;
    heightMap: number[][];

    constructor(maxX: number, maxY: number, doorX: number, doorY: number, doorZ: number, doorRot: number, heightMap: number[][]) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.doorX = doorX;
        this.doorY = doorY;
        this.doorZ = doorZ;
        this.doorRot = doorRot;
        this.heightMap = heightMap;
    }

    static getDummyRoomModel(): RoomModel {
        const maxX = 9;
        const maxY = 13;
        const doorX = 0;
        const doorY = 4;
        const doorZ = 0.0;
        const doorRot = 2;

        const map: number[][] = new Array();
        for (let i = 0; i < maxX; i++) {
            map.push([]);
            for (let j = 0; j < maxY; j++) {
                map[i].push(1);
            }
        }

        return new RoomModel(maxX, maxY, doorX, doorY, doorZ, doorRot, map);
    }

    isValidTile(x: number, y: number): boolean {
        return (x >= 0 && x < this.maxX && y >= 0 && y < this.maxY && this.heightMap[x][y] != 0);
    }
}
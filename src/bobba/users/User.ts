export default class User {
    id: number
    name: string
    motto: string
    look: string;
    
    constructor(id: number, name: string, motto: string, look: string) {
        this.id = id;
        this.name = name;
        this.motto = motto;
        this.look = look;
    }

}
import {randomUUID} from "crypto";

export class Employee {
    private name: string;
    private id: string;
    constructor(name:string) {
        this.name = name;
        this.id = randomUUID();
    }
}